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
import {User} from '../models/user';
import {TokenStorageService} from '../services/token-storage.service';

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
  selectedCCList!: Warehouse[];
  messageList: Message[] = [];
  selectedMessage: Message = new Message();
  currentUser!: User;

  constructor(private notifyService: NotificationService, private route: ActivatedRoute, private tokenStorageService: TokenStorageService,
              private warehouseService: WarehouseService, private messageService: MessageService,
              private router: Router, private service: ParcelService, private fileService: FileUploadService) {
  }

  ngOnInit(): void {
    this.currentUser = this.tokenStorageService.getUser();
    this.route.params.subscribe(params => {
      if (params.id && params.id > 0) {
        this.service.getById(params.id).subscribe(existinParcel => {
          if (!existinParcel) {
            this.router.navigate(['parcels']);
          } else {
            this.getParcelPackages(existinParcel.id);
            this.selectedObject = existinParcel;
            this.getWarehouseList();
          }
        });
      }
    });
  }

  sendMsg(): void {
    // @ts-ignore
    this.selectedMessage.parcel = {id: this.selectedObject.id};
    // @ts-ignore
    this.selectedMessage.author = {id: this.currentUser.id};
    if (this.selectedCCList) {
      this.selectedCCList.forEach(w => {
        // @ts-ignore
        this.selectedMessage.cc.push({cc: {id: w.id}});
      });
    }
    console.log(this.selectedMessage);
    this.messageService.create(this.selectedMessage).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
      this.getParcelMessages();
      this.clearMsg();
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', '');
      console.log(error);
    });
  }

  clearMsg(): void {
    this.selectedMessage = new Message();
    this.selectedCCList = [];
  }

  getWarehouseList(): void {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          // @ts-ignore
          return this.warehouseService.getList(1000, 0, '');
        }),
        map(data => {
          // @ts-ignore
          return data.items;
        }),
        catchError(a => {
          console.log(a);
          return observableOf([]);
        })
      ).subscribe(data => this.warehouseList = data);
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
      console.log(data);
      console.log(this.statusHistoryList);
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
}
