import {AfterViewInit, Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {ContactBackendApi, ContactService} from '../services/contact.service';
import {MatPaginator} from '@angular/material/paginator';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ContactAddressService} from '../services/contact-address.service';
import {NotificationService} from '../services/notification.service';
import {ContactAddress} from '../models/contact-address';
import {merge, of as observableOf, pipe} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {Contact} from '../models/contact';
import {UtilService} from '../services/util.service';
import {CityService} from '../services/city.service';
import {City} from '../models/city';

@Component({
  selector: 'app-contact-address',
  templateUrl: './contact-address.component.html',
  styleUrls: ['./contact-address.component.scss']
})
export class ContactAddressComponent implements AfterViewInit {
  // @ts-ignore
  srchObj: ContactAddress = {contact: {id: 0, name: ''}};
  data = new MatTableDataSource<ContactBackendApi>();
  displayedColumns: string[] = ['id', 'city', 'street', 'contactPerson', 'postCode', 'contactPersonPhone', 'contactPersonEmail', 'action'];

  resultsLength = 0;
  isLoadingResults = true;
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);

  constructor(private route: ActivatedRoute, private router: Router, public dialog: MatDialog, private contactService: ContactService,
              private service: ContactAddressService, private notifyService: NotificationService, private utilService: UtilService) {
  }

  ngAfterViewInit(): void {
    this.route.params.subscribe(params => {
      this.contactService.getById(params.id).subscribe(cont => {
        if (!cont) {
          this.router.navigate(['contacts']);
        }
        // @ts-ignore
        this.srchObj.contact = {id: cont.id, name: cont.name};
        this.getMainData();
        this.isLoadingResults = false;
        this.resultsLength = 0;
      });
    });
  }

  getMainData(): void {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          // @ts-ignore
          return this.service.getList(this.utilService.encode(this.srchObj, ''));
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

  save(obj: ContactAddress): void {
    // @ts-ignore
    obj.contact = {id: this.srchObj.contact.id}; // set contact With Id Retrieved From URL
    this.service.create(obj).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', 'ჩანაწერის დამატება');
      window.location.reload();
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', 'ჩანაწერის დამატება');
      console.log(error);
    });
  }

  update(obj: ContactAddress): void {
    // @ts-ignore
    obj.contact = {id: this.srchObj.contact.id}; // set contact With Id Retrieved From URL
    this.service.update(obj).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', 'ჩანაწერის განახლება');
      window.location.reload();
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', 'ჩანაწერის განახლება');
      console.log(error);
    });
  }

  delete(obj: ContactAddress): void {
    this.service.delete(obj.id).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', 'ჩანაწერის წაშლა');
      window.location.reload();
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', 'ჩანაწერის წაშლა');
      console.log(error);
    });
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(ContactAddressDialogContent, {data: obj, maxWidth: '50%'});
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
export class ContactAddressDialogContent implements OnInit {
  action: string;
  selectedObject: any;
  cities: City [] = [];

  constructor(public dialogRef: MatDialogRef<ContactAddressDialogContent>, private cityService: CityService,
              // @Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data: Contact) {
    this.selectedObject = {...data};
    this.action = this.selectedObject.action;
    if (!this.selectedObject.city) {
      this.selectedObject.city = {};
    }
  }

  doAction(): void {
    this.dialogRef.close({event: this.action, data: this.selectedObject});
  }

  closeDialog(): void {
    this.dialogRef.close({event: 'Cancel'});
  }

  ngOnInit(): void {
    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.cityService.getList(10000, 0);
      }),
      map(data => {
        // @ts-ignore
        this.cities = data.items;
        // @ts-ignore
        return data.items;
      }),
      catchError(() => {
        return observableOf([]);
      })
    ).subscribe(data => {
      this.cities = data;
    });
  }
}
