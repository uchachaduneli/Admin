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

@Component({
  selector: 'app-invoice-generaation',
  templateUrl: './invoice-generaation.component.html',
  styleUrls: ['./invoice-generaation.component.scss']
})
export class InvoiceGeneraationComponent implements AfterViewInit {

  // @ts-ignore
  srchObj: InvoiceDTO = {};
  // @ts-ignore
  selectedObject: InvoiceDTO = {};
  data = new MatTableDataSource<InvoiceDTOBackendApi>();
  displayedColumns: string[] = ['id', 'name', 'action'];

  resultsLength = 0;
  isLoadingResults = true;
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);

  parcels: Parcel[] = [];

  constructor(public dialog: MatDialog,
              private utilService: UtilService,
              private service: InvoiceService,
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

  getPayersUnInvoicedParcelsList(): void {
    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.service.getPayersUnInvoicedParcelsList(this.selectedObject.identNumber);
      }), map(data => {
        // @ts-ignore
        return data.items;
      }), catchError(() => {
        return observableOf([]);
      })
    ).subscribe(data => {
      this.parcels = data;
      console.log(data);
    });
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

  openDialog(action: string, obj: any): void {
    // obj.action = action;
    // const dialogRef = this.dialog.open(CityDialogContent, {
    //   data: obj,
    // });
    // // @ts-ignore
    // dialogRef.afterClosed().subscribe(result => {
    //   if (!!result) {
    //     if (result.event === 'Add') {
    //       console.log(result);
    //       this.save(result.data);
    //     } else if (result.event === 'Update') {
    //       this.update(result.data);
    //     } else if (result.event === 'Delete') {
    //       this.delete(result.data);
    //     }
    //   }
    // });
  }

}
