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
  public dateControl1 = new FormControl();
  data = new MatTableDataSource<Parcel>();
  displayedColumns: string[] = ['barCode', 'totalPrice', 'deliveryTime', 'senderName',
    'senderIdentNumber', 'receiverName', 'receiverIdentNumber', 'senderCity', 'receiverCity', 'action'];
  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);

  constructor(private service: InvoiceService, private datePipe: DatePipe,
              private notifyService: NotificationService,
              private route: ActivatedRoute, private router: Router,
              private utilService: UtilService) {
  }

  ngAfterViewInit(): void {
    this.isLoadingResults = false;
    this.resultsLength = 0;
    this.route.params.subscribe(params => {
      if (params.identNumber) {
        this.getPayersUnInvoicedParcelsList(params.identNumber);
      } else {
        this.router.navigate(['invoice-pregeneration']);
      }
    });
  }

  getPayersUnInvoicedParcelsList(identNumber: string): void {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.service.getPayersUnInvoicedParcelsList(this.paginator.pageSize, this.paginator.pageIndex, identNumber);
        }),
        map(data => {
          this.isLoadingResults = false;
          // @ts-ignore
          this.resultsLength = data.total_count;
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
        this.selectedObj = {name: data[0].payerName, identNumber};
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
  }

  generate(): void {
    if (this.dateControl1.value) {
      // @ts-ignore
      this.selectedObj.operationDate = this.datePipe.transform(new Date(this.dateControl1.value), 'yyyy-MM-ddTHH:mm:ss');
    } else {
      this.notifyService.showError('ოპერაციის თარიღის მითითება სავალდებულოა', 'ინვოისის გენერაცია');
      return;
    }
    this.selectedObj.parcels = this.data.data;
    this.service.create(this.selectedObj).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', 'ინვოისის გენერაცია');
      window.location.reload();
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', 'ინვოისის გენერაცია');
      console.log(error);
    });
  }
}
