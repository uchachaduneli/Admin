import {AfterViewInit, Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {ParcelDTO} from '../models/parcel-dto';
import {MatTableDataSource} from '@angular/material/table';
import {InvoiceService} from '../services/invoice.service';
import {NotificationService} from '../services/notification.service';
import {UtilService} from '../services/util.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {Parcel} from '../models/parcel';
import {InvoiceDTO} from '../models/invoice-dto';
import {FormControl} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {ParcelStatusReason} from '../models/parcel-status-reason';
import {ParcelStatus} from '../models/parcel-status';
import {ParcelStatusService} from '../services/parcel-status.service';

@Component({
  selector: 'app-invoice-generation',
  templateUrl: './invoice-generation.component.html',
  styleUrls: ['./invoice-generation.component.scss']
})
export class InvoiceGenerationComponent implements AfterViewInit {
  // @ts-ignore
  srchObj: ParcelDTO = {};
  // @ts-ignore
  selectedObj: InvoiceDTO = {};
  payerName!: string;
  payerIdentNumber!: string;
  totalPriceSum = 0.0;
  public dateControl1 = new FormControl(new Date());
  data = new MatTableDataSource<Parcel>();
  displayedColumns: string[] = ['barCode', 'totalPrice', 'deliveryTime', 'senderName',
    'senderIdentNumber', 'receiverName', 'receiverIdentNumber', 'senderCity', 'receiverCity', 'action'];
  resultsLength = 0;
  isLoadingResults = true;
  public dateControl3 = new FormControl();
  public dateControl4 = new FormControl();
  statusReasons!: ParcelStatusReason[];
  public filteredStatusReasons: ParcelStatusReason[] = [];
  statuses!: ParcelStatus[];
  public filteredStatuses: ParcelStatus[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);

  constructor(private service: InvoiceService, private datePipe: DatePipe,
              private notifyService: NotificationService, private statusService: ParcelStatusService,
              private route: ActivatedRoute, private router: Router,
              private utilService: UtilService) {
  }

  ngAfterViewInit(): void {
    this.isLoadingResults = false;
    this.resultsLength = 0;
    this.getMainData();

    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.statusService.getList(1000, 0, '');
      }),
      map(data => {
        // @ts-ignore
        return data.items;
      }),
      catchError(() => {
        return observableOf([]);
      })
    ).subscribe(data => {
      this.statuses = data;
      this.filteredStatuses = this.statuses.slice();
    });
  }

  clearFilters(): void {
    this.initSubParams();
    this.getMainData();
  }

  onStatusSelect(selectedStatusId: number): void {
    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.statusService.getByParcelStatusId(this.srchObj.statusId);
      }),
      map(data => {
        // @ts-ignore
        return data.items;
      }),
      catchError(() => {
        return observableOf([]);
      })
    ).subscribe(data => {
      this.statusReasons = data;
      this.filteredStatusReasons = this.statusReasons.slice();
      this.getMainData();
    });
  }

  initSubParams(): void {
    // @ts-ignore
    this.srchObj = {};
    this.dateControl3 = new FormControl();
    this.dateControl4 = new FormControl();
  }

  getPayersUnInvoicedParcelsList(): void {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.service.getPayersUnInvoicedParcelsList(this.paginator.pageSize, this.paginator.pageIndex,
            this.utilService.encode(this.srchObj));
        }),
        map(data => {
          this.isLoadingResults = false;
          // @ts-ignore
          this.resultsLength = data.total_count;
          // @ts-ignore
          this.totalPriceSum = data.total_price_sum;
          // @ts-ignore
          return data.items;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => {
      console.log(data);
      this.data = new MatTableDataSource<Parcel>(data);
      if (data && data.length > 0) {
        // @ts-ignore
        this.payerName = data[0].payerName;
      }
    });
  }

  removeFromInvoiceList(barCode: string): void {
    const tmpData = this.data.data;
    console.log(tmpData);
    // @ts-ignore
    tmpData.forEach((element, index) => {
      if (element.barCode === barCode) {
        tmpData.splice(index, 1);
        console.log('after remove', tmpData);
        this.data = new MatTableDataSource<Parcel>(tmpData);
      }
    });
    this.totalPriceSum = tmpData.reduce((tmpSum, parcel) => tmpSum += parcel.totalPrice, 0.0);
  }

  generate(): void {
    if (this.dateControl1.value) {
      // @ts-ignore
      this.selectedObj.operationDate = this.datePipe.transform(new Date(this.dateControl1.value), 'yyyy-MM-ddTHH:mm:ss');
    } else {
      this.notifyService.showError('ოპერაციის თარიღის მითითება სავალდებულოა', 'ინვოისის გენერაცია');
      return;
    }
    this.selectedObj.identNumber = this.payerIdentNumber;
    this.selectedObj.name = this.payerName;
    this.selectedObj.parcels = this.data.data;
    this.service.create(this.selectedObj).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', 'ინვოისის გენერაცია');
      window.location.reload();
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', 'ინვოისის გენერაცია');
      console.log(error);
    });
  }

  getMainData(): void {
    this.prepareDatesForSearch();
    this.route.params.subscribe(params => {
      if (params.identNumber) {
        this.payerIdentNumber = params.identNumber;
        this.srchObj.payerIdentNumber = params.identNumber;
        this.getPayersUnInvoicedParcelsList();
      } else {
        this.router.navigate(['invoice-pregeneration']);
      }
    });
  }

  prepareDatesForSearch(): void {
    if (this.dateControl3.value) {
      // @ts-ignore
      this.srchObj.strCreatedTime = this.datePipe.transform(new Date(this.dateControl3.value), 'yyyy-MM-ddTHH:mm:ss');
    }
    if (this.dateControl4.value) {
      // @ts-ignore
      this.srchObj.strCreatedTimeTo = this.datePipe.transform(new Date(this.dateControl4.value), 'yyyy-MM-ddTHH:mm:ss');
    }
    console.log(this.srchObj);
  }
}
