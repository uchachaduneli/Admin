import {AfterViewInit, Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {UserService} from '../services/user.service';
import {NotificationService} from '../services/notification.service';
import {UtilService} from '../services/util.service';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {Parcel} from '../models/parcel';
import {MatTableDataSource} from '@angular/material/table';
import {ParcelBackendApi, ParcelService} from '../services/parcel.service';
import {MatPaginator} from '@angular/material/paginator';
import {User} from '../models/user';
import {TokenStorageService} from '../services/token-storage.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-delivery-details',
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.scss']
})
export class DeliveryDetailsComponent implements AfterViewInit {
  // @ts-ignore
  srchObj: Parcel = {};
  data = new MatTableDataSource<ParcelBackendApi>();
  displayedColumns: string[] = ['barCode', 'senderName', 'receiverName', 'payerName', 'weight', 'status', 'createdTime', 'action'];
  resultsLength = 0;
  isLoadingResults = true;
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);
  usersList: User [] = [];
  currentUser!: User;
  selectedUserId!: number;

  constructor(private service: ParcelService,
              private notifyService: NotificationService,
              private tokenStorageService: TokenStorageService,
              private utilService: UtilService,
              private userService: UserService,
              public dialog: MatDialog) {
  }

  ngAfterViewInit(): void {
    this.currentUser = this.tokenStorageService.getUser();
    if (this.currentUser) {
      this.loadUsers();
    }
  }

  loadUsers(): void {
    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.userService.getList(1000, 0, '&srchRoleName=COURIER,OFFICE');
      }),
      map(data => {
        // @ts-ignore
        return data.items;
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
      data: obj,
    });
    // @ts-ignore
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        //
      }
    });
  }

  printDetails(): void {
    // @ts-ignore
    const divElements = document.getElementById('printDelDetailsDivId').innerHTML;
    const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    // @ts-ignore
    popupWin.document.open();
    // @ts-ignore
    popupWin.document.write(`<html><head><style>body { -webkit-print-color-adjust: exact !important; }</style></head><body onload="window.print();window.close()">${divElements}</body></html>`);
    // @ts-ignore
    popupWin.document.close();
  }

  getMainData(): void {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          // @ts-ignore
          return this.service.getList(this.paginator.pageSize, this.paginator.pageIndex, );
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
      ).subscribe(data => this.data = data);
  }

}


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dialog-content',
  templateUrl: 'dialog-content.html',
})

// tslint:disable-next-line:component-class-suffix
export class DeliveryDetailsDialogContent implements OnInit {
  action: string;
  selectedObject: any;

  constructor(public dialogRef: MatDialogRef<DeliveryDetailsDialogContent>,
              // @Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data: Parcel) {
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
