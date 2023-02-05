import {AfterViewInit, Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {InvoiceDTO} from '../models/invoice-dto';
import {InvoiceDTOBackendApi, InvoiceService} from '../services/invoice.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UtilService} from '../services/util.service';
import {NotificationService} from '../services/notification.service';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {ContactService} from '../services/contact.service';
import {ParcelDC} from '../parcel-list/parcel-list.component';

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
  invoiceStatuses!: string[];
  invoicePaymentStatuses!: string[];
  resultsLength = 0;
  isLoadingResults = true;
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);

  public dateControl3 = new FormControl();
  public dateControl4 = new FormControl();

  constructor(public dialog: MatDialog,
              private utilService: UtilService,
              private service: InvoiceService,
              private datePipe: DatePipe,
              private notifyService: NotificationService) {
  }

  ngAfterViewInit(): void {
    this.isLoadingResults = false;
    this.resultsLength = 0;
    this.getMainData();
    this.loadStatusFilters();
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


  loadStatusFilters(): void {
    this.service.getInvoiceStatuses().subscribe(res => {
      // @ts-ignore
      this.invoiceStatuses = res;
    });
    this.service.getInvoicePaymentStatuses().subscribe(res => {
      // @ts-ignore
      this.invoicePaymentStatuses = res;
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

  pay(obj: InvoiceDTO): void {
    this.service.pay(obj).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
      this.getMainData();
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', 'ჩანაწერის წაშლა');
      console.log(error);
    });
  }

  sendInvoice(obj: InvoiceDTO): void {
    this.service.sendEmail(obj).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
      this.getMainData();
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', 'ჩანაწერის წაშლა');
      console.log(error);
    });
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(InvoiceDialogContent, {
      data: obj,
    });
    // @ts-ignore
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        if (result.event === 'PayAmount') {
          console.log(result);
          this.pay(result.data);
        } else if (result.event === 'Email') {
          this.sendInvoice(result.data);
        } else if (result.event === 'Delete') {
          this.delete(result.data);
        }
      }
    });
  }

}


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dialog-content',
  templateUrl: 'dialog-content.html',
})

// tslint:disable-next-line:component-class-suffix
export class InvoiceDialogContent implements AfterViewInit {
  action: string;
  selectedObject: any;
  frozenPayedAmout!: number;


  constructor(public dialogRef: MatDialogRef<InvoiceDialogContent>, private service: InvoiceService,
              private contactService: ContactService,
              private notifyService: NotificationService,
              // @Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data: InvoiceDTO) {
    this.selectedObject = {...data};
    this.action = this.selectedObject.action;
    this.frozenPayedAmout = this.selectedObject.payedAmount ? this.selectedObject.payedAmount : 0;
    console.log(data);
  }

  doAction(): void {
    this.dialogRef.close({event: this.action, data: this.selectedObject});
  }

  closeDialog(): void {
    this.dialogRef.close({event: 'Cancel'});
  }

  getPayerEmailIfExists(): void {
    this.contactService.getByIdentNum(this.selectedObject.identNumber).subscribe(cont => {
      console.log('contact by this ident Num', cont);
      if (!cont) {
        this.notifyService.showInfo('გადამხდელზე ელ.ფოსტოს მოძიება ვერ მოხერხდა, გთხოვთ მიუთითოთ ხელით', '');
      } else {
        this.selectedObject.emailToSent = cont.email;
      }
    });
  }

  calculatePayedAmount(): void {
    if (this.selectedObject.amount && this.selectedObject.newAmount) {
      if (!this.selectedObject.payedAmount) {
        this.selectedObject.payedAmount = this.selectedObject.newAmount;
      } else {
        this.selectedObject.payedAmount = this.frozenPayedAmout + this.selectedObject.newAmount;
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.action === 'Email' && this.selectedObject.identNumber) {
      this.getPayerEmailIfExists();
    }
    if (this.selectedObject.payedAmount && this.selectedObject.payedAmount > 0) {
      this.selectedObject.newAmount = this.selectedObject.amount - this.selectedObject.payedAmount;
    }
  }

}
