import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ParcelDTO} from '../models/parcel-dto';
import {MatTableDataSource} from '@angular/material/table';
import {InvoiceService} from '../services/invoice.service';
import {NotificationService} from '../services/notification.service';
import {UtilService} from '../services/util.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {ParcelBackendApi} from '../services/parcel.service';

@Component({
  selector: 'app-invoice-generation',
  templateUrl: './invoice-generation.component.html',
  styleUrls: ['./invoice-generation.component.scss']
})
export class InvoiceGenerationComponent implements AfterViewInit {
// @ts-ignore
  srchObj: ParcelDTO = {};
  // @ts-ignore
  payer: { name: string, identNumber: string };
  data = new MatTableDataSource<ParcelBackendApi>();
  displayedColumns: string[] = ['barCode', 'action'];
  resultsLength = 0;
  isLoadingResults = true;
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);

  constructor(private service: InvoiceService,
              private notifyService: NotificationService,
              private changeDetectorRef: ChangeDetectorRef,
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
          return this.service.getPayersUnInvoicedParcelsList(this.paginator.pageSize,
            this.paginator.pageIndex, identNumber);
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
      console.log(this.data);
      this.data = new MatTableDataSource<ParcelBackendApi>(data);
      console.log(this.data);
      if (data && data.length > 0) {
        // @ts-ignore
        this.payer = {name: data[0].payerName, identNumber};
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  removeFromInvoiceList(barCode: string): void {
    // @ts-ignore
    // this.data.forEach((element, index) => {
    //   if (element.barCode === barCode) {
    //     // this.datasrc.splice(index, 1);
    //   }
    // });
  }
}
