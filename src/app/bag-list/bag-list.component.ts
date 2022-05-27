import {AfterViewInit, Component, Inject, Optional, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Parcel} from '../models/parcel';
import {BagBackendApi, BagService} from '../services/bag.service';
import {Warehouse} from '../models/warehouse';
import {NotificationService} from '../services/notification.service';
import {WarehouseService} from '../services/warehouse.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Bag} from '../models/bag';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {ParcelService} from '../services/parcel.service';
import {ParcelStatusReason} from '../models/parcel-status-reason';
import {ParcelStatusService} from '../services/parcel-status.service';

@Component({
  selector: 'app-bag-list',
  templateUrl: './bag-list.component.html',
  styleUrls: ['./bag-list.component.scss']
})
export class BagListComponent implements AfterViewInit {
  srchObj = new Bag();
  selectedObject!: Bag;
  data = new MatTableDataSource<BagBackendApi>();
  displayedColumns: string[] = ['barCode', 'from', 'to', 'status', 'createdTime', 'action'];
  resultsLength = 0;
  isLoadingResults = true;
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);
  parcels: Parcel [] = [];
  warehouseList: Warehouse [] = [];

  constructor(private service: BagService,
              private notifyService: NotificationService,
              private warehouseService: WarehouseService,
              public dialog: MatDialog) {

  }

  barcodeToStrArray(): string[] {
    let res: string[] = [];
    if (this.selectedObject && this.selectedObject.barCode) {
      res = [this.selectedObject.barCode];
    }
    return res;
  }

  print(selected: Bag): void {
    this.selectedObject = selected;
    setTimeout(() => {
      // @ts-ignore
      const divElements = document.getElementById('printBagDivId').innerHTML;
      const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      // @ts-ignore
      popupWin.document.open();
      // @ts-ignore
      popupWin.document.write(`<html><head><style>
</style></head><body onload="window.print();window.close()">${divElements}</body></html>`);
      // @ts-ignore
      popupWin.document.close();
    }, 1000);
  }

  ngAfterViewInit(): void {
    this.loadWarehouseList();
    this.getMainData();
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(BagDialogContent, {
      data: obj, width: action === 'statusManager' ? '50%' : '80%'
    });
    // @ts-ignore
    dialogRef.afterClosed().subscribe(result => {
      if (result.event === 'Add') {
        this.save(result.data);
      } else if (result.event === 'Update') {
        this.update(result.data);
      } else if (result.event === 'Delete') {
        this.delete(result.data);
      }
    });
  }

  save(obj: Bag): void {
    this.service.create(obj).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
      window.location.reload();
    }, error => {
      this.notifyService.showError(error.error.includes('მითითებული') ? error.error : '', 'ჩანაწერის დამატება');
      console.log(error);
    });
  }

  update(obj: Bag): void {
    this.service.update(obj).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
      window.location.reload();
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', 'ჩანაწერის განახლება');
      console.log(error);
    });
  }

  delete(obj: Bag): void {
    this.service.delete(obj.id).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
      window.location.reload();
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', 'ჩანაწერის წაშლა');
      console.log(error);
    });
  }

  getMainData(): void {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          // @ts-ignore
          return this.service.getList(this.paginator.pageSize, this.paginator.pageIndex, '');
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

  loadWarehouseList(): void {
    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.warehouseService.getList(1000, 0, '');
      }),
      map(data => {
        // @ts-ignore
        return data.items;
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

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'bag-dialog-content',
  templateUrl: 'dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class BagDialogContent {
  action: string;
  parcelBarCode!: string;
  selectedObject!: any;
  warehouseList!: Warehouse[];
  markedForStatusChanges: string [] = [];
  multiplesStatus!: number;
  statuses!: ParcelStatusReason[];

  constructor(public dialogRef: MatDialogRef<BagDialogContent>,
              // @Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data: Bag,
              private service: BagService,
              private statusService: ParcelStatusService,
              private parcelService: ParcelService,
              private notifyService: NotificationService,
              private warehouseService: WarehouseService) {
    this.selectedObject = {...data};
    this.action = this.selectedObject.action;
    this.loadWarehouseList();
    if (this.selectedObject.action === 'Add') {
      this.getNewBarcode();
      this.selectedObject.from = {};
      this.selectedObject.status = {id: 12};
      this.selectedObject.to = {};
      this.selectedObject.parcels = [];
    }
    this.getStatusesList();
    console.log(this.selectedObject);
  }

  getStatusesList(): void {
    if (this.action === 'statusManager') {
      merge()
        .pipe(
          startWith({}),
          switchMap(() => {
            return this.statusService.getAllStatusReasons();
          }),
          map(data => {
            // @ts-ignore
            return data.items;
          }),
          catchError(() => {
            return observableOf([]);
          })
        ).subscribe(data => this.statuses = data);
    }
  }

  bindParcelToBag(): void {
    if (!this.parcelBarCode || this.parcelBarCode.length < 1) {
      this.notifyService.showError('გთხოვთ მიუთითოთ დასამატებელი ამანათის ბარკოდი!', '');
      return;
    }
    // @ts-ignore
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


  removeFromList(parcel: Parcel): void {
    // @ts-ignore
    this.selectedObject.parcels.forEach((element, index) => {
      if (element.barCode === parcel.barCode) {
        this.selectedObject.parcels.splice(index, 1);
      }
    });
  }



  getNewBarcode(): void {
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
      this.selectedObject.barCode = data as string;
    });
  }

  loadWarehouseList(): void {
    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.warehouseService.getList(1000, 0, '');
      }),
      map(data => {
        // @ts-ignore
        return data.items;
      }),
      catchError(err => {
        console.error(err);
        return observableOf([]);
      })
    ).subscribe(data => {
      this.warehouseList = data;
    });
  }

  doAction(): void {
    if (this.action === 'statusManager') {
      this.dialogRef.close({
        event: this.action,
        data: {statusId: this.multiplesStatus, barCodes: this.markedForStatusChanges}
      });
    } else {
      this.dialogRef.close({event: this.action, data: this.selectedObject});
    }
  }

  closeDialog(): void {
    this.dialogRef.close({event: 'Cancel'});
  }
}
