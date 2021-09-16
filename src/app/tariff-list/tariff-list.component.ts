import {AfterViewInit, Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NotificationService} from '../services/notification.service';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {TariffBackendApi, TariffService} from '../services/tariff.service';
import {Tariff} from '../models/tariff';

@Component({
  selector: 'app-tariff-list',
  templateUrl: './tariff-list.component.html',
  styleUrls: ['./tariff-list.component.scss']
})
export class TariffListComponent implements AfterViewInit {
  // @ts-ignore
  srchObj: Tariff = {};
  data = new MatTableDataSource<TariffBackendApi>();
  displayedColumns: string[] = ['id', 'name', 'updatedTime', 'createdTime', 'action'];

  resultsLength = 0;
  isLoadingResults = true;
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);

  constructor(public dialog: MatDialog, private service: TariffService, private notifyService: NotificationService) {
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
          return this.service.getList();
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

  save(obj: Tariff): void {
    this.service.create(obj).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
      window.location.reload();
    }, error => {
      this.notifyService.showError(!!error.error && error.error.includes('მითითებული') ? error.error : 'ოპერაცია არ სრულდება', 'ჩანაწერის განახლება');
      console.log(error);
    });
  }

  update(obj: Tariff): void {
    this.service.update(obj).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
      window.location.reload();
    }, error => {
      this.notifyService.showError(!!error.error && error.error.includes('მითითებული') ? error.error : 'ოპერაცია არ სრულდება', 'ჩანაწერის განახლება');
      console.log(error);
    });
  }

  delete(obj: Tariff): void {
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
    const dialogRef = this.dialog.open(TariffDialogContent, {data: obj, maxWidth: '50%'});
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
export class TariffDialogContent implements OnInit {
  action: string;
  selectedObject: any;

  constructor(public dialogRef: MatDialogRef<TariffDialogContent>,
              // @Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data: Tariff) {
    this.selectedObject = {...data};
    this.action = this.selectedObject.action;
  }

  doAction(): void {
    this.dialogRef.close({event: this.action, data: this.selectedObject});
  }

  closeDialog(): void {
    this.dialogRef.close({event: 'Cancel'});
  }

  ngOnInit(): void {
  }
}
