import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {NotificationService} from '../services/notification.service';
import {UtilService} from '../services/util.service';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {Waybill} from '../models/waybill';
import {WayBillBackendApi, WaybillService} from '../services/waybill.service';
import {FormControl} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {WaybillDTO} from '../models/waybill-dto';

@Component({
  selector: 'app-waybill-list',
  templateUrl: './waybill-list.component.html',
  styleUrls: ['./waybill-list.component.scss']
})
export class WaybillListComponent implements AfterViewInit {
  IsProcessing = 'გზავნილი მუშავდება';
  NoBarCodeIntoComment = 'კომენტარში ბარკოდი ვერ მოიძებნა';
  NoParcesFound = 'გზავნილი ვერ მოიძებნა';
  syncStatsArr = [this.IsProcessing, this.NoBarCodeIntoComment, this.NoParcesFound];
  // @ts-ignore
  srchObj: WaybillDTO = {};
  data = new MatTableDataSource<WayBillBackendApi>();
  displayedColumns: string[] = ['rsCreateDate', 'buyerName', 'buyerTin', 'carNumber', 'driverName'
    , 'driverTin', 'endAddress', 'startAddress', 'waybillComment', 'waybillNumber', 'syncStatus'];
  resultsLength = 0;
  isLoadingResults = true;
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);
  public dateControl3 = new FormControl();
  public dateControl4 = new FormControl();

  constructor(public dialog: MatDialog, private service: WaybillService, private datePipe: DatePipe,
              private notifyService: NotificationService, private utilService: UtilService) {
  }

  ngAfterViewInit(): void {
    this.getMainData();
  }

  clearFilters(): void {
    this.srchObj = {} as WaybillDTO;
    this.dateControl3 = new FormControl();
    this.dateControl4 = new FormControl();
    this.getMainData();
  }

  getMainData(): void {
    if (this.dateControl3.value) {
      // @ts-ignore
      this.srchObj.strRsCreateDate = this.datePipe.transform(new Date(this.dateControl3.value), 'yyyy-MM-ddTHH:mm:ss');
    }
    if (this.dateControl4.value) {
      // @ts-ignore
      this.srchObj.strRsCreateDateTo = this.datePipe.transform(new Date(this.dateControl4.value), 'yyyy-MM-ddTHH:mm:ss');
    }
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
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => this.data = data);
  }

  openDialog(action: string, obj: any): void {
    // obj.action = action;
    // const dialogRef = this.dialog.open(WaybillDetailsDialogContent, {data: obj, maxWidth: '50%'});
    // // @ts-ignore
    // dialogRef.afterClosed().subscribe(result => {
    //   if (!!result) {
    //     if (result.event === 'Add') {
    //       console.log(result);
    //       this.save(result.data);
    //     } else if (result.event === 'Update') {
    //       this.update(result.data);
    //     } else if (result.event === 'Delete') {
    //       this.delete(result.data);
    //     }
    //   }
    // });
  }

}
