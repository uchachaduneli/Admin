import {Component, OnInit} from '@angular/core';
import {Parcel} from '../models/parcel';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {Packages} from '../models/packages';
import {ActivatedRoute, Router} from '@angular/router';
import {ParcelService} from '../services/parcel.service';
import {ParcelStatusHistory} from '../models/parcel-status-history';
import {NotificationService} from '../services/notification.service';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {FileUploadService} from '../services/file-upload.service';
import {Files} from '../models/files';
import {WarehouseService} from '../services/warehouse.service';
import {Warehouse} from '../models/warehouse';
import {Message} from '../models/message';
import {MessageService} from '../services/message.service';

@Component({
  selector: 'app-parcel-details',
  templateUrl: './parcel-details.component.html',
  styleUrls: ['./parcel-details.component.scss']
})
export class ParcelDetailsComponent implements OnInit {
  selectedObject: Parcel = new Parcel();
  packages!: Packages[];
  statusHistoryList!: ParcelStatusHistory[];
  fileList!: Files[];
  warehouseList!: Warehouse[];
  messageList: Message[] = [];

  constructor(private notifyService: NotificationService, private route: ActivatedRoute,
              private warehouseService: WarehouseService, private messageService: MessageService,
              private router: Router, private service: ParcelService, private fileService: FileUploadService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params.id && params.id > 0) {
        this.service.getById(params.id).subscribe(existinParcel => {
          if (!existinParcel) {
            this.router.navigate(['parcels']);
          } else {
            this.getParcelPackages(existinParcel.id);
            this.selectedObject = existinParcel;
          }
        });
      }
    });
  }

  getParcelMessages(): void {
    if (!this.selectedObject) {
      this.getParcelIdFromUrl();
    }
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          // @ts-ignore
          return this.messageService.getByParcelId(this.selectedObject.id);
        }),
        map(data => {
          // @ts-ignore
          return data;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => {
      this.messageList = data as Message[];
      // const rows$ = of(data as Message[]);
      // this.totalRows$ = rows$.pipe(map(rows => rows.length));
      // // @ts-ignore
      // this.displayedRows$ = rows$.pipe(sortRows(this.sortEvents$), paginateRows(this.pageEvents$));
    });
  }

  getWarehouseList(): void {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          // @ts-ignore
          return this.service.getList(1000, 0, null);
        }),
        map(data => {
          // @ts-ignore
          this.resultsLength = data.total_count;
          // @ts-ignore
          return data.items;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => this.warehouseList = data);
  }

  getParcelPackages(id: number): void {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.service.getByPackageId(id);
        }),
        map(data => {
          // @ts-ignore
          return data;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => {
      this.packages = data as Packages[];
    });
  }

  private getParcelIdFromUrl(): void {
    this.route.params.subscribe(params => {
      if (params.id && params.id > 0) {
        this.service.getById(params.id).subscribe(existinParcel => {
          if (!existinParcel) {
            this.router.navigate(['parcels']);
          } else {
            this.selectedObject = existinParcel;
          }
        });
      }
    });
  }

  loadStatusHistory(): void {
    if (!this.selectedObject) {
      this.getParcelIdFromUrl();
    }
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.service.getStatusHistoryByParceId(this.selectedObject.id);
        }),
        map(data => {
          // @ts-ignore
          return data;
        }),
        catchError(() => {
          this.notifyService.showError('ჩექპოინტების წამოღება ვერ მოხერხდა', '');
          return observableOf([]);
        })
      ).subscribe(data => {
      this.statusHistoryList = data as ParcelStatusHistory[];
    });
  }

  loadParcelFiles(): void {
    if (!this.selectedObject) {
      this.getParcelIdFromUrl();
    }
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.fileService.getFiles(this.selectedObject.id);
        }),
        map(data => {
          // @ts-ignore
          return data;
        }),
        catchError(() => {
          this.notifyService.showError('ფაილების ჩატვირთვა ვერ მოხერხდა', '');
          return observableOf([]);
        })
      ).subscribe(data => {
      this.fileList = data as Files[];
    });
  }

  handleTabChanges($event: MatTabChangeEvent): void {
    if ($event.index === 1) {
      this.loadStatusHistory();
    } else if ($event.index === 2) {
      this.loadParcelFiles();
    } else if ($event.index === 3) {
      this.getParcelMessages();
    }
  }
}
