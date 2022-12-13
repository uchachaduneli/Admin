import {AfterViewInit, Component, Input} from '@angular/core';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {ParcelService} from '../services/parcel.service';
import {NotificationService} from '../services/notification.service';
import {Parcel} from '../models/parcel';
import {Packages} from '../models/packages';
import {ParcelWithPackagesDTO} from '../models/parcel-with-packages-dto';

export class PagesToPrint {
  copies: number[];
  packages: number[];

  constructor(copies: number[], packages: number[]) {
    this.copies = copies;
    this.packages = packages;
  }
}

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements AfterViewInit {

  @Input() parcelId!: number;
  @Input() excelImportedParcelsIdes!: string;
  @Input() excelImportedPrint!: boolean;
  excelImportedParcels!: ParcelWithPackagesDTO[];
  selectedObject = new Parcel();
  dynamicArray: Array<Packages> = [];
  printStikerOrZednadebi = 1;
  copiesCount = 1;
  copies: number[] = [1];
  pagesToPrint!: PagesToPrint[];
  pageToPrint!: PagesToPrint;

  constructor(private parcelService: ParcelService,
              private notifyService: NotificationService) {
    // this.multiplyPages();
  }

  ngAfterViewInit(): void {
    console.log('excelImportedPrint', this.excelImportedPrint);
    console.log('excelImportedParcelsIdes', this.excelImportedParcelsIdes);
    console.log('parcelId', this.parcelId);
    this.loadimportedParcelsData();
    if (this.parcelId) {
      this.loadParcelData();
      this.getParcelPackages();
    }
  }

  loadimportedParcelsData(): void {
    if (this.excelImportedPrint) {
      this.printStikerOrZednadebi = 1; // importis gverdze sul stikers printaven
      this.parcelService.getWithPackagesWhereIdIn(this.excelImportedParcelsIdes).subscribe(res => {
        // @ts-ignore
        this.excelImportedParcels = res;
        this.multiplyPages();
      }, error => {
        this.notifyService.showError('ბეჭდვისთვის გადატანილი ჩანაწერების წამოღება ვერ მოხერხდა', '');
        console.log(error);
      });
    }
  }

  multiplyPages(): void {
    this.copies = [...Array(this.selectedObject.count).keys()];
    if (this.excelImportedPrint && this.copies?.length > 1) {
      // @ts-ignore
      const tmpImportedParcels: ParcelWithPackagesDTO = [];
      this.excelImportedParcels.forEach((p) => {
        this.copies.forEach(() => {
          if (!p.packages || p.packages.length === 0) {
            // @ts-ignore
            p.packages.push({});
          }
          // @ts-ignore
          tmpImportedParcels.push(p);
        });
      });
      // @ts-ignore
      this.excelImportedParcels = tmpImportedParcels;
      console.log('excelImportedParcels', +this.excelImportedParcels);
    } else {
      // console.log('selected ', this.selectedObject);
      this.pageToPrint = new PagesToPrint(this.copies, [...Array(this.selectedObject.count).keys()]);
      // console.log('pagetoprint ', this.pageToPrint);
    }
  }

  idToBarcode(parcel: Parcel): string[] {
    if (!parcel) {
      return this.selectedObject.barCode ? [this.selectedObject.barCode] : [];
    } else {
      return parcel.barCode ? [parcel.barCode] : [];
    }
  }

  printAction(): void {
    this.loadimportedParcelsData();
    this.multiplyPages();
    if (this.printStikerOrZednadebi === 1) {
      this.printDivContent('printStickerContent');
    } else if (this.printStikerOrZednadebi === 2) {
      this.printDivContent('printZednadebiContent');
    }
  }

  printDivContent(divId: string): void {
    // @ts-ignore
    const divElements = document.getElementById(divId).innerHTML;
    const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    // @ts-ignore
    popupWin.document.open();
    // @ts-ignore
    popupWin.document.write(`<html><head><style>body { -webkit-print-color-adjust: exact !important; }</style></head><body onload="window.print();window.close()">${divElements}</body></html>`);
    // @ts-ignore
    popupWin.document.close();
  }

  loadParcelData(): void {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.parcelService.getById(this.parcelId);
        }),
        map(data => {
          return data;
        }), catchError(() => {
          this.notifyService.showError('მოძებნა ვერ მოხერხდა', '');
          return observableOf([]);
        })
      ).subscribe(data => {
      // @ts-ignore
      this.selectedObject = data;
      console.log('data ', this.selectedObject);
      this.multiplyPages();
    });
  }

  getParcelPackages(): void {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.parcelService.getByPackageId(this.parcelId);
        }),
        map(data => {
          // @ts-ignore
          return data;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => {
      let totalVolWeight = 0.0;
      const packs: Packages[] = data as Packages[];
      packs.forEach(p => {
        this.dynamicArray.push(p);
        totalVolWeight += p.volumeWeight;
      });
      this.selectedObject.volumeWeight = totalVolWeight;
    });
  }

}
