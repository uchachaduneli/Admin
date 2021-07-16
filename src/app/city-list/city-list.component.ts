import {AfterViewInit, Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NotificationService} from '../services/notification.service';
import {merge, Observable, of as observableOf, pipe} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {CityBackendApi, CityService} from '../services/city.service';
import {City} from '../models/city';
import {Zone} from '../models/zone';
import {FormControl} from '@angular/forms';
import {ZoneService} from '../services/zone.service';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss']
})
export class CityListComponent implements AfterViewInit {


  data = new MatTableDataSource<CityBackendApi>();
  displayedColumns: string[] = ['id', 'name', 'code', 'zone', 'updatedTime', 'createdTime', 'action'];

  resultsLength = 0;
  isLoadingResults = true;
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);

  constructor(public dialog: MatDialog, private service: CityService, private notifyService: NotificationService) {
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

  save(obj: City): void {
    this.service.create(obj).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
      window.location.reload();
    }, error => {
      this.notifyService.showError(error.error.includes('მითითებული') ? error.error : '', 'ჩანაწერის დამატება');
      console.log(error);
    });
  }

  update(obj: City): void {
    this.service.update(obj).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
      window.location.reload();
    }, error => {
      this.notifyService.showError(error.error.includes('მითითებული') ? error.error : '', 'ჩანაწერის განახლება');
      console.log(error);
    });
  }

  delete(obj: City): void {
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
    const dialogRef = this.dialog.open(CityDialogContent, {
      data: obj
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
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dialog-content',
  templateUrl: 'dialog-content.html',
})

// tslint:disable-next-line:component-class-suffix
export class CityDialogContent implements AfterViewInit {
  action: string;
  selectedObject: any;
  myControl = new FormControl();
  filteredOptions: Observable<Zone[]> = Object.create(null);

  constructor(public dialogRef: MatDialogRef<CityDialogContent>, private service: ZoneService,
              // @Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data: City) {
    this.selectedObject = {...data};
    this.action = this.selectedObject.action;
  }

  doAction(): void {
    this.dialogRef.close({event: this.action, data: this.selectedObject});
  }

  closeDialog(): void {
    this.dialogRef.close({event: 'Cancel'});
  }

  displayFn(obj?: Zone): string | undefined {
    return obj ? obj.name : undefined;
  }

  ngAfterViewInit(): void {
    this.service.getList(1000, 0).subscribe(data => {
      console.log(data);
      // this.filteredOptions = data.items;
    });
    console.log(this.filteredOptions);
  }
}
