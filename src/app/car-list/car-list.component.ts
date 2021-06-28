import {AfterViewInit, Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {NotificationService} from '../services/notification.service';
import {Car} from '../models/car';
import {CarBackendApi, CarService} from '../services/car.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent implements AfterViewInit {

  data = new MatTableDataSource<CarBackendApi>();//CarBackendApi[] = [];
  displayedColumns: string[] = ['id', 'name', 'carNumber', 'updatedTime', 'createdTime', 'action'];

  resultsLength = 0;
  isLoadingResults = true;
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);

  constructor(public dialog: MatDialog, private service: CarService, private notifyService: NotificationService) {
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
          return this.service.getList(this.paginator.pageSize, this.paginator.pageIndex);
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

  save(obj: Car): void {
    this.service.create(obj).subscribe(data => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
    }, error => {
      this.notifyService.showError(error.error.includes('მითითებული') ? error.error : '', 'ჩანაწერის დამატება');
      console.log(error);
    });
  }

  update(obj: Car): void {
    this.service.update(obj).subscribe(data => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
      window.location.reload();
    }, error => {
      this.notifyService.showError(error.error.includes('მითითებული') ? error.error : '', 'ჩანაწერის განახლება');
      console.log(error);
    });
  }

  delete(obj: Car): void {
    this.service.delete(obj.id).subscribe(data => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', 'ჩანაწერის წაშლა');
      console.log(error);
    });
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AddDialogContent, {
      data: obj
    });

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

  applyFilter(filterValue: string): void {
    this.notifyService.showInfo('filter Inputs value is ' + filterValue, 'Filters Value');
    // this.objectsList.filter = filterValue.trim().toLowerCase();
  }
}


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dialog-content',
  templateUrl: 'add-dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class AddDialogContent {
  action: string;
  selectedObject: any;
  selectedImage: any = '';
  joiningDate: any = '';

  constructor(public dialogRef: MatDialogRef<AddDialogContent>,
              // @Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data: Car) {
    this.selectedObject = {...data};
    this.action = this.selectedObject.action;
  }

  doAction(): void {
    this.dialogRef.close({event: this.action, data: this.selectedObject});
  }

  closeDialog(): void {
    this.dialogRef.close({event: 'Cancel'});
  }
}
