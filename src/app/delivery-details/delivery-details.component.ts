import {AfterViewInit, ChangeDetectorRef, Component, Inject, Optional, ViewChild} from '@angular/core';
import {UserService} from '../services/user.service';
import {NotificationService} from '../services/notification.service';
import {UtilService} from '../services/util.service';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {Parcel} from '../models/parcel';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {User} from '../models/user';
import {TokenStorageService} from '../services/token-storage.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DeliveryDetailBackendApi, DeliveryDetailsService} from '../services/delivery-details.service';
import {DeliveryDetail} from '../models/delivery-detail';
import {Route} from '../models/route';
import {Warehouse} from '../models/warehouse';
import {WarehouseService} from '../services/warehouse.service';
import {RouteService} from '../services/route.service';
import {ParcelService} from '../services/parcel.service';
import {City} from '../models/city';
import {ParcelStatus} from '../models/parcel-status';
import {ParcelStatusReason} from '../models/parcel-status-reason';
import {ParcelStatusService} from '../services/parcel-status.service';
import {DeliveryDetailParcelDTO} from '../models/delivery-detail-parcel-dto';
import {FormControl} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {CityService} from '../services/city.service';

@Component({
  selector: 'app-delivery-details',
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.scss']
})
export class DeliveryDetailsComponent implements AfterViewInit {
  srchObj = new DeliveryDetail();
  selectedObject!: DeliveryDetail;
  data = new MatTableDataSource<DeliveryDetailBackendApi>();
  displayedColumns: string[] = ['detailBarCode', 'user', 'createdTime', 'action'];
  resultsLength = 0;
  srchCityId = 0;
  isLoadingResults = true;
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);
  usersList: User [] = [];
  currentUser!: User;
  selectedUser!: User;
  routes: Route [] = [];
  warehouseList: Warehouse [] = [];
  parcelBarCode!: string;
  currentDate = new Date();
  public dateControl3 = new FormControl();
  public dateControl4 = new FormControl();
  public filteredSenderCitiesList: City[] = [];
  cities: City [] = [];
  courierOrReception = false;

  constructor(private service: DeliveryDetailsService,
              private notifyService: NotificationService,
              private tokenStorageService: TokenStorageService,
              private utilService: UtilService,
              private datePipe: DatePipe,
              private userService: UserService,
              private parcelService: ParcelService,
              private cityService: CityService,
              private warehouseService: WarehouseService,
              private routeService: RouteService,
              public dialog: MatDialog) {

    this.selectedObject = new DeliveryDetail();
    // @ts-ignore
    this.selectedObject.route = {};
    // @ts-ignore
    this.selectedObject.warehouse = {};

    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.service.getBarCode();
      }),
      map(data => {
        // @ts-ignore
        return data;
      }),
      catchError(err => {
        console.error(err);
        return observableOf([]);
      })
    ).subscribe(data => {
      this.selectedObject.detailBarCode = data as string;
    });
  }

  courierOrReceptionHandler(event: any): void {
    this.courierOrReception = event.checked;
  }

  clearFilters(): void {
    // @ts-ignore
    this.srchObj = {city: {}, warehouse: {}, route: {}, srchRoleName: []};
    this.getMainData();
    this.srchCityId = 0;
  }

  onCitySelect(): void {
    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.routeService.getByCityId(this.srchCityId);
      }),
      map(data => {
        // @ts-ignore
        return data;
      }),
      catchError(() => {
        return observableOf([]);
      })
    ).subscribe(data => {
      this.routes = data;
    });
  }

  barcodeToStrArray(): string[] {
    return this.selectedObject && this.selectedObject.detailBarCode ? [this.selectedObject.detailBarCode] : [];
  }

  bindParcelToDetail(): void {
    if (!this.parcelBarCode || this.parcelBarCode.length < 1) {
      this.notifyService.showError('გთხოვთ მიუთითოთ დასამატებელი ამანათის ბარკოდი!', '');
      return;
    }
    if (this.selectedObject.parcels.length > 0 && this.selectedObject.parcels.filter(ex => ex.barCode === this.parcelBarCode).length > 0) {
      this.notifyService.showSuccess('ამანათი მითითებული ბარკოდით უკვე სიაშია', '');
      return;
    }
    this.parcelService.getByBarCode(this.parcelBarCode).subscribe(p => {
      this.parcelBarCode = '';
      this.notifyService.showSuccess('ამანათი ბარკოდით ' + this.parcelBarCode + 'დამატებულია სიაში', '');
      console.log(p);
      // @ts-ignore
      this.selectedObject.parcels.push({id: p.id, barCode: p.barCode});
    }, error => {
      this.notifyService.showError('ამანათი ვერ მოიძებნა !!!', '');
      console.log(error);
    });
    // @ts-ignore
    document.getElementById('parcelBarCode').focus();
  }

  saveDeliveryDetail(): void {
    if (!this.courierOrReception && (!this.selectedObject.carNumber || this.selectedObject.carNumber.length < 7)) {
      this.notifyService.showError('კურიერის შემთხვევაში ავტომობილის ნომრის მითითება სავალდებულოა !', '');
      return;
    }
    this.selectedObject.courierOrReception = this.courierOrReception ? 2 : 1; // false=courier true=reception
    console.log(this.selectedObject);
    this.service.create(this.selectedObject).subscribe(() => {
      this.notifyService.showSuccess('ჩაბარების დეტალები შენახულია', 'ჩანაწერის დამატება');
      window.location.reload();
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', 'ჩანაწერის დამატება');
      console.log(error);
    });
  }

  addNewDetail(): void {
    window.location.reload();
  }

  ngAfterViewInit(): void {
    this.currentUser = this.tokenStorageService.getUser();
    if (this.currentUser) {
      this.loadUsers();
      this.getMainData();
    }

    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.cityService.getList(1000, 0, '');
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
      this.filteredSenderCitiesList = this.cities.slice();
    });
  }

  onUserSelect(user: any): void {
    console.log(this.selectedUser);
    // @ts-ignore
    this.selectedObject.warehouse = {id: this.selectedUser.warehouse?.id};
    // @ts-ignore
    this.selectedObject.route = {id: this.selectedUser.route?.id};
    this.selectedObject.user = this.selectedUser;
    this.loadDropdownsData();
  }

  loadDropdownsData(): void {
    if (this.selectedUser && this.selectedUser.city) {
      merge().pipe(
        startWith({}),
        switchMap(() => {
          return this.routeService.getByCityId(this.selectedUser.city.id);
        }),
        map(data => {
          // @ts-ignore
          return data;
        }),
        catchError(err => {
          console.error(err);
          return observableOf([]);
        })
      ).subscribe(data => {
        this.routes = data;
      });

      merge().pipe(
        startWith({}),
        switchMap(() => {
          return this.warehouseService.getByCityId(this.selectedUser.city.id);
        }),
        map(data => {
          // @ts-ignore
          return data;
        }),
        catchError(err => {
          console.error(err);
          return observableOf([]);
        })
      ).subscribe(data => {
        this.warehouseList = data;
      });
    }
  }

  loadUsers(): void {
    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.userService.getByHavingRoles('COURIER,OFFICE');
      }),
      map(data => {
        // @ts-ignore
        return data;
      }),
      catchError(() => {
        return observableOf([]);
      })
    ).subscribe(data => {
      this.usersList = data;
    });
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(DeliveryDetailsDialogContent, {
      data: obj, width: '80%', disableClose: true
    });
    // @ts-ignore
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.event === 'Cancel') {
        this.getMainData();
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

  deleteImportedRow(obj: DeliveryDetail): void {
    this.service.delete(obj.id).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
      window.location.reload();
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', 'ჩანაწერის წაშლა');
      console.log(error);
    });
  }

  printDetails(selected: DeliveryDetail): void {
    this.selectedObject = selected;
    console.log(selected);
    setTimeout(() => {
      // @ts-ignore
      const divElements = document.getElementById('printDelDetailsDivId').innerHTML;
      const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      // @ts-ignore
      popupWin.document.open();
      // @ts-ignore
      popupWin.document.write(`<html><head><style>body { -webkit-print-color-adjust: exact !important; }
   #detailsPrintDataTable tr th{
      border: 1px solid black;
      background-color: cyan;
    }
    #detailsPrintDataTable {
      width: 100%;
      font-size: 8px;
    }
    #detailsPrintDataTable tr td {
      text-align: center;
      border: 1px solid black;
      height: 20px;
    }
    #detailsPrintDataTable tr td:first-child {
      border-right: 1px dashed gray;
      max-width: 200px;
      min-width: 100px;
      word-wrap: break-word;
    }
    #detailsPrintDataTable tr td:last-child {
      border-left: 1px dashed gray;
    }
    #detailsPrintDataTable tr td:nth-child(2) {
      border-left: 1px dashed gray;
      border-right: 1px dashed gray;
    }
    #detailsPrintDataTable tr td:nth-child(3) {
      border-left: 1px dashed gray;
      border-right: 1px dashed gray;
    }
    #detailsPrintDataTable tr td:nth-child(4) {
      border-left: 1px dashed gray;
      border-right: 1px dashed gray;
    }
    #detailsPrintDataTable tr td:nth-child(5) {
      border-left: 1px dashed gray;
      border-right: 1px dashed gray;
    }
    #detailsPrintDataTable tr td:nth-child(6) {
      border-left: 1px dashed gray;
    }
    #detailsPrintDataTable tr:nth-child(even) td {
      border-top: 1px dashed gray !important;
    }
    #detailsPrintDataTable tr:nth-child(odd) td {
      border-bottom: 1px dashed gray !important;
    }
</style></head><body onload="window.print();window.close()">${divElements}</body></html>`);
      // @ts-ignore
      popupWin.document.close();
    }, 1000);
  }

  getMainData(): void {
    this.prepareDatesForSearch();
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          // @ts-ignore
          return this.service.getList(this.paginator.pageSize, this.paginator.pageIndex, this.utilService.encode(this.srchObj));
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          // @ts-ignore
          this.resultsLength = data.total_count;
          // @ts-ignore
          return data.items;
        }), catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => {
      this.data = data;
    });
  }

}

// ******************   Details History Row Full Info Dialog With Parcels Table ************************
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dialog-content',
  templateUrl: 'dialog-content.html',
})

// tslint:disable-next-line:component-class-suffix
export class DeliveryDetailsDialogContent implements AfterViewInit {
  action: string;
  receivedData: any;
  selectedObject!: Parcel;
  datasrc: Parcel[] = [];
  displayedColumns: string[] = ['barCode', 'senderName', 'receiverName', 'payerName', 'weight', 'status', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);

  constructor(public dialogRef: MatDialogRef<DeliveryDetailsDialogContent>,
              // @Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data: DeliveryDetail,
              private parcelService: ParcelService,
              private notifyService: NotificationService,
              private service: DeliveryDetailsService,
              private changeDetectorRef: ChangeDetectorRef,
              public dialog: MatDialog) {
    this.receivedData = {...data};
    this.datasrc = data.parcels;
    this.action = this.receivedData.action;
  }

  doAction(): void {
    this.dialogRef.close({event: this.action, data: this.selectedObject});
  }

  closeDialog(): void {
    this.dialogRef.close({event: 'Cancel'});
  }

  openParcelEditDialog(obj: any): void {
    const dialogRef = this.dialog.open(ParcelEditDlgContent, {
      data: obj, width: '50%'
    });
    // @ts-ignore
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.update(result.data);
      }
    });
  }

  reloadDetailsParcels(): void {
    this.service.getById(this.receivedData.id).subscribe(det => {
      this.datasrc = det.parcels;
      console.log('detail with updated parcels -> ', det);
      this.changeDetectorRef.detectChanges();
    }, error => {
      this.notifyService.showError('ცვლილების შემდეგ ინტერფეისის განახლება ვერ მოხერხდა', '');
      console.log(error);
    });
  }

  update(obj: Parcel): void {
    this.parcelService.updateDeliveryDetailParcel(
      new DeliveryDetailParcelDTO(obj.deliveryTime, obj.receiverName,
        obj.receiverIdentNumber, obj.status, obj.id, obj.statusNote)).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
      this.reloadDetailsParcels();
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', 'ჩანაწერის განახლება');
      console.log(error);
    });
  }

  ngAfterViewInit(): void {
  }
}


// ******************   Details Parcels Row Edit Dialog ************************
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'parcel-edit-dialog-content',
  templateUrl: 'parcel-edit-dialog.html',
})

// tslint:disable-next-line:component-class-suffix
export class ParcelEditDlgContent implements AfterViewInit {
  selectedObject!: any;
  statuses!: ParcelStatus[];
  public filteredStatuses: ParcelStatus[] = [];
  selectedStatus!: ParcelStatus;
  statusReasons!: ParcelStatusReason[];
  public filteredStatusReasons: ParcelStatusReason[] = [];
  showStatusNoteInput = false;
  whatToWrite = '';

  constructor(public dialogRef: MatDialogRef<ParcelEditDlgContent>,
              private parcelStatusService: ParcelStatusService,
              // @Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data: Parcel) {
    this.selectedObject = {...data};
    // @ts-ignore
    this.selectedStatus = {id: this.selectedObject.status?.status?.id};
  }

  doAction(): void {
    this.dialogRef.close({data: this.selectedObject});
  }

  closeDialog(): void {
    this.dialogRef.close({event: 'Cancel'});
  }

  ngAfterViewInit(): void {
    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.parcelStatusService.getList(1000, 0, '');
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
    if (this.selectedStatus) {
      this.onStatusSelect(this.selectedStatus.id);
    }
  }

  onStatusSelect(selectedStatusId: number): void {
    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.parcelStatusService.getByParcelStatusId(selectedStatusId);
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
      if (this.selectedObject.status) {
        this.onSubStatusSet(this.selectedObject.status.id);
      }
    });
  }

  onSubStatusSet(selectedStatusId: number): void {
    const selectedStatusReason: ParcelStatusReason = this.statusReasons.filter(s => s.id === selectedStatusId)[0];
    if (selectedStatusReason && (selectedStatusReason.name.includes('<') || selectedStatusReason.name.includes('/'))) {
      this.showStatusNoteInput = true;
      this.whatToWrite = '< ' + selectedStatusReason.name.substring(selectedStatusReason.name.indexOf('<') + 1,
        selectedStatusReason.name.lastIndexOf('>')) + ' >';
    } else {
      this.showStatusNoteInput = false;
      this.whatToWrite = '';
    }
  }
}

