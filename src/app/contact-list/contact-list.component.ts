import {AfterViewInit, Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NotificationService} from '../services/notification.service';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {ContactBackendApi, ContactService} from '../services/contact.service';
import {Contact} from '../models/contact';
import {ContactAddressService} from '../services/contact-address.service';
import {UtilService} from '../services/util.service';
import {Tariff} from '../models/tariff';
import {TariffByZone} from '../models/tariff-by-zone';
import {TariffService} from '../services/tariff.service';


@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements AfterViewInit {
  // @ts-ignore
  srchObj: Contact = {};
  data = new MatTableDataSource<ContactBackendApi>();
  displayedColumns: string[] = ['id', 'name', 'identNumber', 'email', 'type', 'user', 'deReGe', 'hasContract', 'action'];

  resultsLength = 0;
  isLoadingResults = true;
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);
  filter: Contact = new Contact();

  tariffs!: TariffByZone[];

  constructor(public dialog: MatDialog, private service: ContactService, private utilService: UtilService,
              private addressService: ContactAddressService, private notifyService: NotificationService) {
  }

  downloadExcel(): void {
    window.open(this.service.getExcel(this.generateQueryParams()), '_blank');
  }

  generateQueryParams(): string {
    const params = new URLSearchParams();
    // tslint:disable-next-line:forin
    for (const key in this.filter) {
      // @ts-ignore
      params.set(key, this.filter[key]);
    }
    return params.toString();
  }

  ngAfterViewInit(): void {
    this.isLoadingResults = false;
    this.resultsLength = 0;
    this.getMainData();
  }

  getMainData(): void {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.service.getList(this.paginator.pageSize, this.paginator.pageIndex, this.utilService.encode(this.srchObj, ''));
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

  save(obj: Contact): void {
    this.service.create(obj).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
      window.location.reload();
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', 'ჩანაწერის განახლება');
      console.log(error);
    });
  }

  update(obj: Contact): void {
    this.service.update(obj).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
      window.location.reload();
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', 'ჩანაწერის განახლება');
      console.log(error);
    });
  }

  delete(obj: Contact): void {
    this.service.delete(obj.id).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
      window.location.reload();
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', 'ჩანაწერის წაშლა');
      console.log(error);
    });
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(ContactDialogContent, {data: obj, maxWidth: '50%'});
    // @ts-ignore
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        if (result.event === 'Add') {
          console.log(result);
          this.save(result.data);
        } else if (result.event === 'Update') {
          this.update(result.data);
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
export class ContactDialogContent implements OnInit {
  action: string;
  selectedObject: any;
  tariffs!: Tariff[];

  constructor(public dialogRef: MatDialogRef<ContactDialogContent>, private tariffService: TariffService,
              // @Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data: Contact) {
    this.selectedObject = {...data};
    console.log(this.selectedObject);
    if (!this.selectedObject.type) {
      this.selectedObject.type = 1;
    }
    if (!this.selectedObject.deReGe) {
      this.selectedObject.deReGe = 1;
    }
    if (!this.selectedObject.user) { // es droebitaa da mere daloginebuli uzeri unda aigos avtomaturad
      this.selectedObject.user = {id: 1};
    }
    if (!this.selectedObject.tariff) {
      this.selectedObject.tariff = new Tariff();
    }
    this.action = this.selectedObject.action;
  }

  doAction(): void {
    this.dialogRef.close({event: this.action, data: this.selectedObject});
  }

  closeDialog(): void {
    this.dialogRef.close({event: 'Cancel'});
  }

  ngOnInit(): void {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.tariffService.getList();
        }),
        map(data => {
          // @ts-ignore
          return data.items;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => this.tariffs = data);
  }

}
