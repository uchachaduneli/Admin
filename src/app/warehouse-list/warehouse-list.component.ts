import {AfterViewInit, Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NotificationService} from '../services/notification.service';
import {UtilService} from '../services/util.service';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {City} from '../models/city';
import {CityService} from '../services/city.service';
import {Contact} from '../models/contact';
import {Warehouse} from '../models/warehouse';
import {WarehouseBackendApi, WarehouseService} from '../services/warehouse.service';

@Component({
  selector: 'app-warehouse-list',
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.scss']
})
export class WarehouseListComponent implements AfterViewInit {
  // @ts-ignore
  srchObj: Warehouse = {};
  data = new MatTableDataSource<WarehouseBackendApi>();
  displayedColumns: string[] = ['id', 'name', 'abbreviature', 'city', 'updatedTime', 'createdTime', 'action'];

  resultsLength = 0;
  isLoadingResults = true;
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);

  constructor(public dialog: MatDialog, private service: WarehouseService,
              private notifyService: NotificationService, private utilService: UtilService) {
  }

  ngAfterViewInit(): void {
    this.getMainData();
  }

  getMainData(): void {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          // @ts-ignore
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

  save(obj: Warehouse): void {
    this.service.create(obj).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', 'ჩანაწერის დამატება');
      window.location.reload();
    }, error => {
      this.notifyService.showError(!!error.error && error.error.includes('მითითებული') ? error.error : 'ოპერაცია არ სრულდება', 'ჩანაწერის დამატება');
      console.log(error);
    });
  }

  update(obj: Warehouse): void {
    this.service.update(obj).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', 'ჩანაწერის განახლება');
      window.location.reload();
    }, error => {
      this.notifyService.showError(!!error.error && error.error.includes('მითითებული') ? error.error : 'ოპერაცია არ სრულდება', 'ჩანაწერის განახლება');
      console.log(error);
    });
  }

  delete(obj: Warehouse): void {
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
    const dialogRef = this.dialog.open(WarehouseDialogContent, {data: obj, maxWidth: '50%'});
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
export class WarehouseDialogContent implements OnInit {
  action: string;
  selectedObject: any;
  cities: City [] = [];

  constructor(public dialogRef: MatDialogRef<WarehouseDialogContent>,
              private cityService: CityService,
              // @Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data: Warehouse) {
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
        return this.cityService.getList(1000, 0, '');
      }),
      map(data => {
        // @ts-ignore
        console.log(data.items);
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
