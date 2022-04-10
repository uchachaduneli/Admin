import {AfterViewInit, Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {Contact} from '../models/contact';
import {UtilService} from '../services/util.service';
import {ContactService} from '../services/contact.service';
import {NotificationService} from '../services/notification.service';
import {DoctypesService} from '../services/doctypes.service';
import {DocType} from '../models/doc-type';
import {Route} from '../models/route';
import {RouteService} from '../services/route.service';
import {ExcelService, ExcelTmpParcelBackendApi} from '../services/excel.service';
import {MatTableDataSource} from '@angular/material/table';
import {ExcelTmpParcel} from '../models/ExcelTmpParcel';
import {MatPaginator} from '@angular/material/paginator';
import {User} from '../models/user';
import {TokenStorageService} from '../services/token-storage.service';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {FileUploadService} from '../services/file-upload.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConfirmDialogComponent, ConfirmDialogModel} from '../confirm-dialog/confirm-dialog.component';
import {ContactAddressService} from '../services/contact-address.service';
import {City} from '../models/city';
import {CityService} from '../services/city.service';
import {FormControl} from '@angular/forms';
import {ContactAddress} from '../models/contact-address';
import {CompanyServicesService} from '../services/company-services.service';
import {Service} from '../models/service';
import {Parcel} from '../models/parcel';

@Component({
  selector: 'app-excel-import',
  templateUrl: './excel-import.component.html',
  styleUrls: ['./excel-import.component.scss']
})
export class ExcelImportComponent implements OnInit, AfterViewInit {

  // @ts-ignore
  srchObj: ExcelTmpParcel = {};
  data = new MatTableDataSource<ExcelTmpParcelBackendApi>();
  displayedColumns: string[] = ['id', 'barCode', 'sender', 'receiverName',
    'receiverContactPerson', 'weight', 'totalPrice', 'action'];
  resultsLength = 0;
  isLoadingResults = true;
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);
  currentUser!: User;
  // @ts-ignore
  foundedSenderContact: Contact = new Contact();
  stikersList!: DocType[];
  routes!: Route[];
  routeId!: number;
  serviceId!: number;
  copiesCount!: number;
  identNumber!: string;
  importedIdes!: string;
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  cities!: City[];
  servicesList!: Service[];
  cityId!: number;
  contactPersonControl = new FormControl();
  contactPhoneControl = new FormControl();
  contactAddressControl = new FormControl();

  contactPersonOptions!: string[];
  contactAddressOptions!: string[];
  contactPhoneOptions!: string[];

  contactPersonFilteredOptions!: Observable<string[]>;
  contactPhoneFilteredOptions!: Observable<string[]>;
  contactAddressFilteredOptions!: Observable<string[]>;
  foundedContactAddresses!: ContactAddress[];

  constructor(private utilService: UtilService,
              private contactService: ContactService,
              private service: ExcelService,
              private notifyService: NotificationService,
              private routeService: RouteService,
              private uploadService: FileUploadService,
              private tokenStorageService: TokenStorageService,
              public dialog: MatDialog,
              private cityService: CityService,
              private services: CompanyServicesService,
              private contactAddressService: ContactAddressService,
              private docTypeService: DoctypesService) {
  }

  ngAfterViewInit(): void {
    this.getImportedDataFromDb();
    this.getCitiesList();
    this.getServicesList();
  }

  onAddressSelect(addr: string): void {
    const filteredContact = this.foundedContactAddresses.filter(o => (o.street + ' ' + o.appartmentDetails) === addr)[0];
    if (filteredContact) {
      this.contactPersonControl.setValue(filteredContact.contactPerson);
      this.contactPhoneControl.setValue(filteredContact.contactPersonPhone);
    }
  }

  downloadExcel(): void {
    window.open(this.service.getExcel(this.currentUser.id), '_blank');
  }

  onCityChange(cityId: number): void {
    // console.log(this.generateQueryParams({
    //   city: {id: cityId},
    //   contact: {id: this.foundedSenderContact.id}
    // }));
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          // @ts-ignore
          return this.contactAddressService.getList(1000, 0, `city.id=${cityId}&contact.id=${this.foundedSenderContact.id}`);
        }),
        map(data => {
          this.isLoadingResults = false;
          // @ts-ignore
          return data.items;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => {
      this.foundedContactAddresses = data;
      this.contactPersonOptions = [];
      this.contactAddressOptions = [];
      this.contactPhoneOptions = [];
      // @ts-ignore
      data.forEach(contAddr => {
        this.contactAddressOptions.push(contAddr.street + ' ' + contAddr.appartmentDetails);
        this.contactPersonOptions.push(contAddr.contactPerson);
        this.contactPhoneOptions.push(contAddr.contactPersonPhone);
      });
      console.log(this.contactAddressOptions);
      console.log(this.contactPersonOptions);
      console.log(this.contactPhoneOptions);
      this.contactPersonControl = new FormControl();
      this.contactPhoneControl = new FormControl();
      this.contactAddressControl = new FormControl();
      this.refreshAutoCompleteFilters();
    });
  }

  getCitiesList(): void {
    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.cityService.getList(1000, 0, '');
      }),
      map(data => {
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

  getServicesList(): void {
    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.services.getList(1000, 0, '');
      }),
      map(data => {
        // @ts-ignore
        return data.items;
      }),
      catchError(() => {
        return observableOf([]);
      })
    ).subscribe(data => {
      this.servicesList = data;
    });
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(ExcelRowDialogContent, {
      data: obj
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event === 'Delete') {
        this.delete(result.data);
      }
    });
  }

  delete(obj: ExcelTmpParcel): void {
    this.service.delete(obj.id).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
      window.location.reload();
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', 'ჩანაწერის წაშლა');
      console.log(error);
    });
  }

  ngOnInit(): void {
    this.currentUser = this.tokenStorageService.getUser();
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.routeService.getList(1000, 0, '');
        }),
        map(data => {
          // @ts-ignore
          return data.items;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => this.routes = data);

    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.docTypeService.getList(1000, 0, '');
        }),
        map(data => {
          // @ts-ignore
          return data.items;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => this.stikersList = data);
  }

  clear(): void {
    this.foundedSenderContact = new Contact();
    this.routeId = 0;
  }

  selectFile(event: any): void {
    this.isLoadingResults = true;
    this.selectedFiles = event.target.files;
    this.upload();
  }

  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;
        this.service.upload(this.currentFile, this.foundedSenderContact.id,
          this.routeId, this.currentUser.id, this.cityId,
          this.contactAddressControl.value, this.contactPersonControl.value,
          this.contactPhoneControl.value, this.serviceId).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              console.log(event.body.message);
              this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
              this.getImportedDataFromDb();
            }
          },
          (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.notifyService.showError(err.error.message, '');
            } else {
              this.notifyService.showError('ფაილის იმპორტი ვერ მოხერხდა!', '');
            }
            this.currentFile = undefined;
          });
      }
      // this.clear();
      this.selectedFiles = undefined;
    }
  }

  moveToMainTable(moveAndPrint: boolean, moveAndNotifyCouriers: boolean): void {
    const dialogData = new ConfirmDialogModel('დაადასტურეთ ოპერაცია', 'შეიმპორტებული ჩანაწერების ძირითად ცხრილში გადატანა');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.event === 'Print') {
          // result.data.printStikerOrZednadebi - 1 print sticker, 2 print zednadebi
          console.log('printCopiesCount ', dialogResult.data);
        } else {
          this.service.moveToMainTable(this.currentUser.id).subscribe(res => {
            this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
            // concatenate ides for printing case
            // console.log('res', res);
            this.importedIdes = (res as Array<Parcel>).map((x) => x.id).join(',');
            // console.log('ides - ', this.importedIdes);
            // console.log('res', res);
            if (moveAndPrint) {
              this.openDialog('Print', {importedIdes: this.importedIdes});
            }
            this.getImportedDataFromDb();
          }, error => {
            if (error.error && error.error.includes('არსებობს')) {
              this.notifyService.showError(error.error, '');
            } else {
              this.notifyService.showError('გადატანა ვერ მოხერხდა', '');
            }
            console.log(error);
            this.isLoadingResults = false;
          });
        }
      }
    });
  }

  getImportedDataFromDb(): void {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.service.getList(this.paginator.pageSize, this.paginator.pageIndex, this.utilService.encode(this.srchObj, ''));
        }),
        map(data => {
          // @ts-ignore
          this.resultsLength = data.total_count;
          // @ts-ignore
          return data.items;
        }), catchError(e => {
          return observableOf([]);
        })
      ).subscribe(data => {
      this.data = data;
      this.isLoadingResults = false;
    });
  }

  searchContact(): void {
    if (this.identNumber && this.identNumber.toString().trim().length > 0) {
      const tmp = {
        identNumber: this.identNumber
      };
      merge()
        .pipe(
          startWith({}),
          switchMap(() => {
            // @ts-ignore
            return this.contactService.getList(10, 0, this.utilService.encode(tmp, ''));
          }),
          map(data => {
            // @ts-ignore
            return data.items;
          }),
          catchError(() => {
            return observableOf([]);
          })
        ).subscribe(data => {
        if (data.length === 0) {
          this.notifyService.showError('მითითებული ნომრით კომპანია ვერ მოიძებნა!', '');
        }
        this.foundedSenderContact = data[0];
      });
    } else {
      this.foundedSenderContact.id = 0;
      this.notifyService.showError('გთხოვთ მიუთითოთ გამგზავნის საიდენტიფიკაციო #', '');
    }
  }

  private refreshAutoCompleteFilters(): void {
    this.contactAddressFilteredOptions = this.contactAddressControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, 1))
      );
    this.contactPersonFilteredOptions = this.contactPersonControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, 2))
      );
    this.contactPhoneFilteredOptions = this.contactPhoneControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, 3))
      );
  }

  // addrssOrPersOrPhone - 1 filter addresses / 2 filter Persons / 3 filter Phones
  private _filter(value: string, addrssOrPersOrPhone: number): string[] {
    const filterValue = value.toLowerCase();
    if (addrssOrPersOrPhone === 1) {
      return this.contactAddressOptions.filter(option => option.toLowerCase().includes(filterValue));
    } else if (addrssOrPersOrPhone === 2) {
      return this.contactPersonOptions.filter(option => option.toLowerCase().includes(filterValue));
    } else if (addrssOrPersOrPhone === 3) {
      return this.contactPhoneOptions.filter(option => option.toLowerCase().includes(filterValue));
    } else {
      return [];
    }
  }
}


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-excel-print',
  templateUrl: 'excel-row-dlg.html',
})
// tslint:disable-next-line: component-class-suffix
export class ExcelRowDialogContent {
  action: string;
  selectedObject: any;
  importedIdes: string;

  constructor(public dialogRef: MatDialogRef<ExcelRowDialogContent>,
              // @Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data: ExcelTmpParcel) {
    this.selectedObject = {...data};
    this.action = this.selectedObject.action;
    this.importedIdes = this.selectedObject.importedIdes;
  }

  doAction(): void {
    this.dialogRef.close({event: this.action, data: this.selectedObject});
  }

  closeDialog(): void {
    this.dialogRef.close({event: 'Cancel'});
  }
}
