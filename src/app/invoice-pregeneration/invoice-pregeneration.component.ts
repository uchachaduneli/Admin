import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {InvoiceDTO} from '../models/invoice-dto';
import {MatTableDataSource} from '@angular/material/table';
import {InvoiceDTOBackendApi, InvoiceService} from '../services/invoice.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {UtilService} from '../services/util.service';
import {NotificationService} from '../services/notification.service';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {Parcel} from '../models/parcel';
import {Router} from '@angular/router';

@Component({
  selector: 'app-invoice-pregeneration',
  templateUrl: './invoice-pregeneration.component.html',
  styleUrls: ['./invoice-pregeneration.component.scss']
})
export class InvoicePregenerationComponent implements AfterViewInit {

  // @ts-ignore
  srchObj: InvoiceDTO = {};
  // @ts-ignore
  selectedObject: InvoiceDTO = {};
  data = new MatTableDataSource<InvoiceDTOBackendApi>();
  displayedColumns: string[] = ['name', 'identNumber', 'parcelsCount', 'amount', 'action'];

  resultsLength = 0;
  isLoadingResults = true;
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);

  parcels: Parcel[] = [];

  constructor(public dialog: MatDialog,
              private utilService: UtilService,
              private service: InvoiceService, private router: Router,
              private notifyService: NotificationService) {
  }

  ngAfterViewInit(): void {
    this.isLoadingResults = false;
    this.resultsLength = 0;
    this.getMainData();
  }

  clearFilters(): void {
    // @ts-ignore
    this.srchObj = {zone: {}};
    this.getMainData();
  }

  getMainData(): void {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.service.getNotYetIinvoicesList(this.paginator.pageSize,
            this.paginator.pageIndex, this.utilService.encode(this.srchObj));
        }),
        map(data => {
          // Flip flag to show that loading has finished.
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
      ).subscribe(data => this.data = data);
  }

  save(obj: InvoiceDTO): void {
    this.service.create(obj).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
      window.location.reload();
    }, error => {
      console.log(error.error);
      this.notifyService.showError(error.error ? error.error.error : 'ოპერაცია არ სრულდება', 'ჩანაწერის დამატება');
    });
  }

  update(obj: InvoiceDTO): void {
    this.service.update(obj).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
      window.location.reload();
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', 'ჩანაწერის განახლება');
      console.log(error);
    });
  }

  delete(obj: InvoiceDTO): void {
    this.service.delete(obj.id).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
      window.location.reload();
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', 'ჩანაწერის წაშლა');
      console.log(error);
    });
  }

  moveToGenetarion(identNumber: string): void {
    this.router.navigate(['invoice-generation', identNumber]);
  }
}

