import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {InvoiceDTO} from '../models/invoice-dto';
import {InvoiceDTOBackendApi, InvoiceService} from '../services/invoice.service';
import {MatDialog} from '@angular/material/dialog';
import {UtilService} from '../services/util.service';
import {NotificationService} from '../services/notification.service';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {ContactService} from '../services/contact.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements AfterViewInit {
// @ts-ignore
  srchObj: InvoiceDTO = {};
  // @ts-ignore
  selectedObj: InvoiceDTO = {};
  data = new MatTableDataSource<InvoiceDTOBackendApi>();
  displayedColumns: string[] = ['id', 'name', 'identNumber', 'status', 'payStatus', 'payedAmount', 'operationDate', 'pdf', 'action'];

  resultsLength = 0;
  isLoadingResults = true;
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);

  public dateControl3 = new FormControl();
  public dateControl4 = new FormControl();

  constructor(public dialog: MatDialog,
              private utilService: UtilService,
              private service: InvoiceService,
              private datePipe: DatePipe,
              private contactService: ContactService,
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
    this.dateControl3 = new FormControl();
    this.dateControl4 = new FormControl();
    this.getMainData();
  }

  prepareDatesForSearch(): void {
    if (this.dateControl3.value) {
      // @ts-ignore
      this.srchObj.operationDate = this.datePipe.transform(new Date(this.dateControl3.value), 'yyyy-MM-ddTHH:mm:ss');
    }
    if (this.dateControl4.value) {
      // @ts-ignore
      this.srchObj.operationDateTo = this.datePipe.transform(new Date(this.dateControl4.value), 'yyyy-MM-ddTHH:mm:ss');
    }
    console.log(this.srchObj);
  }

  getPayerEmailIfExists(identNumber: string): void {
    this.contactService.getByIdentNum(identNumber).subscribe(cont => {
      console.log('contact by this ident Num', cont);
      if (!cont) {
        this.notifyService.showInfo('გადამხდელზე ელ.ფოსტოს მოძიება ვერ მოხერხდა, ინვოისის გენერაციისთვის გთხოვთ მიუთითოთ ხელით', '');
      } else {
        this.selectedObj.emailToSent = cont.email;
      }
    });
  }

  getMainData(): void {
    this.prepareDatesForSearch();
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.service.getInvoicesList(this.paginator.pageSize, this.paginator.pageIndex, this.utilService.encode(this.srchObj));
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
