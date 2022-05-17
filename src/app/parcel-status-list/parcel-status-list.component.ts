import {AfterViewInit, Component, Inject, Optional, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NotificationService} from '../services/notification.service';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {ParcelStatus} from '../models/parcel-status';
import {ParcelStatusBackendApi, ParcelStatusService} from '../services/parcel-status.service';

@Component({
  selector: 'app-parcel-status-list',
  templateUrl: './parcel-status-list.component.html',
  styleUrls: ['./parcel-status-list.component.scss']
})
export class ParcelStatusListComponent implements AfterViewInit {

  data = new MatTableDataSource<ParcelStatusBackendApi>();
  displayedColumns: string[] = ['id', 'name', 'code', 'updatedTime', 'createdTime', 'action'];

  resultsLength = 0;
  isLoadingResults = true;
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);
  filter: ParcelStatus = new ParcelStatus();

  constructor(public dialog: MatDialog, private service: ParcelStatusService, private notifyService: NotificationService) {
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
          return this.service.getList(this.paginator.pageSize, this.paginator.pageIndex, '');
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

  save(obj: ParcelStatus): void {
    this.service.create(obj).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
      window.location.reload();
    }, error => {
      this.notifyService.showError(!!error.error ? 'ოპერაცია არ სრულდება' : '', 'ჩანაწერის განახლება');
      console.log(error);
    });
  }

  update(obj: ParcelStatus): void {
    this.service.update(obj).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
      window.location.reload();
    }, error => {
      this.notifyService.showError(!!error.error ? 'ოპერაცია არ სრულდება' : '', 'ჩანაწერის განახლება');
      console.log(error);
    });
  }

  delete(obj: ParcelStatus): void {
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
    const dialogRef = this.dialog.open(ParcelStatusDialogContent, {data: obj, maxWidth: '50%'});
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
export class ParcelStatusDialogContent {
  action: string;
  selectedObject: any;

  constructor(public dialogRef: MatDialogRef<ParcelStatusDialogContent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: ParcelStatus) {
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
