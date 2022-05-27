import {Component, OnInit} from '@angular/core';
import {Warehouse} from '../models/warehouse';
import {ParcelStatusReason} from '../models/parcel-status-reason';
import {ParcelStatusService} from '../services/parcel-status.service';
import {ParcelService} from '../services/parcel.service';
import {NotificationService} from '../services/notification.service';
import {ParcelStatus} from '../models/parcel-status';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-status-manager',
  templateUrl: './status-manager.component.html',
  styleUrls: ['./status-manager.component.scss']
})
export class StatusManagerComponent implements OnInit {
  showStatusNoteInput = false;
  whatToWrite = '';
  parcelBarCode!: string;
  statusNote!: string;
  markedForStatusChanges: string [] = [];
  multiplesStatus!: number;
  statuses!: ParcelStatus[];
  public filteredStatuses: ParcelStatus[] = [];
  // @ts-ignore
  selectedStatus: ParcelStatus = {};
  statusReasons!: ParcelStatusReason[];
  public filteredStatusReasons: ParcelStatusReason[] = [];

  constructor(private statusService: ParcelStatusService,
              private service: ParcelService,
              private notifyService: NotificationService) {
  }

  ngOnInit(): void {
    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.statusService.getList(1000, 0, '');
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
  }

  onStatusSelect(selectedStatusId: number): void {
    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.statusService.getByParcelStatusId(selectedStatusId);
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
    });
  }

  changeStatuses(): void {
    this.service.changeMultiplesStatuses({
      barCodes: this.markedForStatusChanges,
      note: this.statusNote,
      statusId: this.multiplesStatus
    }).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
      this.resetVariables();
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', 'სტატუსების განახლება');
      console.log(error);
    });
  }

  addForMultipleStatusChange(): void {
    if (!this.parcelBarCode || this.parcelBarCode.length < 1) {
      this.notifyService.showError('გთხოვთ მიუთითოთ ბარკოდი!', '');
      return;
    }
    // @ts-ignore
    if (this.markedForStatusChanges.filter(ex => ex === this.parcelBarCode).length > 0) {
      this.notifyService.showSuccess(' მითითებული ბარკოდი უკვე სიაშია', '');
      return;
    }
    this.service.getByBarCode(this.parcelBarCode).subscribe(p => {
      this.parcelBarCode = '';
      this.notifyService.showSuccess(' ბარკოდი ' + this.parcelBarCode + 'დამატებულია სიაში', '');
      console.log(p);
      // @ts-ignore
      this.markedForStatusChanges.push(p.barCode);
    }, error => {
      this.notifyService.showError('ბარკოდი ბაზაში ვერ მოიძებნა !!!', '');
      console.log(error);
    });
    // @ts-ignore
    document.getElementById('barcodeInpForMultStatus').focus();
  }

  resetVariables(): void {
    // @ts-ignore
    this.parcelBarCode = undefined;
    // @ts-ignore
    this.multiplesStatus = undefined;
    // @ts-ignore
    this.selectedStatus = {};
    this.markedForStatusChanges = [];
  }

  removeFromStatusList(barcode: string): void {
    // @ts-ignore
    this.markedForStatusChanges.forEach((element, index) => {
      if (element === barcode) {
        this.markedForStatusChanges.splice(index, 1);
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
