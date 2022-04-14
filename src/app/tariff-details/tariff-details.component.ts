import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../services/notification.service';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {TariffDetail} from '../models/tariff-detail';
import {TariffService} from '../services/tariff.service';
import {Tariff} from '../models/tariff';
import {Zone} from '../models/zone';
import {ZoneService} from '../services/zone.service';
import {UtilService} from '../services/util.service';
import {TariffByZone} from '../models/tariff-by-zone';
import * as _ from 'lodash';
import {CompanyServicesService} from '../services/company-services.service';
import {Service} from '../models/service';
import {MatTabChangeEvent} from '@angular/material/tabs';

@Component({
  selector: 'app-tariff-details',
  templateUrl: './tariff-details.component.html',
  styleUrls: ['./tariff-details.component.scss']
})
export class TariffDetailsComponent implements AfterViewInit, OnInit {
  // @ts-ignore
  mainObj: Tariff = {id: 0, name: ''};
  tariffDetails!: TariffDetail[];
  zones!: Zone[];
  tarifByZones: TariffByZone[] = [];
  markedForDeletion: TariffByZone[] = [];
  servicesList: Service[] = [];
  selectedService!: Service;

  constructor(private route: ActivatedRoute, private router: Router,
              private zoneService: ZoneService, private cdr: ChangeDetectorRef,
              private service: TariffService, private services: CompanyServicesService,
              private notifyService: NotificationService,
              private utilService: UtilService) {
  }

  ngOnInit(): void {
    this.getServicesList();
  }

  ngAfterViewInit(): void {
    this.route.params.subscribe(params => {
      this.service.getById(params.id).subscribe(tariff => {
        if (!tariff) {
          this.router.navigate(['tariff']);
        }
        // @ts-ignore
        this.mainObj = tariff;
        // this.getMainData();
        this.getZones();
      });
    });
  }

  handleTabChanges($event: MatTabChangeEvent): void {
    this.selectedService = this.servicesList[$event.index];
    this.getMainData();
  }

  getServicesList(): void {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          // @ts-ignore
          return this.services.getList(20, 0, '');
        }),
        map(data => {
          // @ts-ignore
          return data.items;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => {
      this.servicesList = data;
      this.selectedService = this.servicesList[0];
    });
  }

  addQuantity(): void {
    const tariffDetail: TariffDetail[] = [];
    this.zones.forEach((zone, index) => {
      // @ts-ignore
      tariffDetail.push(new TariffDetail(null, zone));
    });
    // @ts-ignore
    this.tarifByZones.push(new TariffByZone(null, tariffDetail));
    // this.quantities().push(this.newRow());
  }

  removeQuantity(i: number): void {
    this.markedForDeletion.push(this.tarifByZones[i]);
    this.tarifByZones.splice(i, 1);
  }

  getZones(): void {
    const srchZone = new Zone(2);
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          // @ts-ignore
          return this.zoneService.getList(100, 0, this.utilService.encode(srchZone, ''));
        }),
        map(data => {
          // @ts-ignore
          return data.items;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => this.zones = data);
  }

  getMainData(): void {
    this.cdr.detectChanges();
    this.tarifByZones = [];
    this.markedForDeletion = [];
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          // @ts-ignore
          return this.service.getByTariffId(this.mainObj.id, this.selectedService.id);
        }),
        map(data => {
          // @ts-ignore
          return data;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => {
      this.tariffDetails = data;
      if (data && data.length > 0) {

        // @ts-ignore
        const grouped = _.groupBy(this.tariffDetails, t => t.weight);
        Object.keys(grouped).forEach(e => {
          let tariffDetailsArr: TariffDetail[] = [];
          grouped[e].forEach(dt => {
            tariffDetailsArr = grouped[e];
          });
          // tslint:disable-next-line:radix
          this.tarifByZones.push({weight: parseInt(e), details: tariffDetailsArr});
        });
        console.log(this.tarifByZones);
      }
    });
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    // @ts-ignore
    const tariffDetailsArr: TariffDetail[] = [];
    this.tarifByZones.forEach(tz => {
      tz.details.forEach(det => {
        // @ts-ignore
        const tariffDet: TariffDetail = {id: det.id, weight: tz.weight, price: det.price};
        // @ts-ignore
        tariffDet.service = {id: this.selectedService.id};
        // @ts-ignore
        tariffDet.tariff = {id: this.mainObj.id};
        // @ts-ignore
        tariffDet.zone = {id: det.zone.id};
        tariffDetailsArr.push(tariffDet);
      });
    });
    // console.log(tariffDetailsArr);
    const forSave = tariffDetailsArr.filter(t => t.id === undefined || t.id === 0);
    const forUpdate = tariffDetailsArr.filter(t => t.id !== undefined && t.id > 0);
    if (forSave && forSave.length > 0) {
      this.save(forSave, false);
    }
    if (forUpdate && forUpdate.length > 0) {
      this.update(forUpdate, false);
    }
    console.log('forSave ->', forSave);
    console.log('forUpdate ->', forUpdate);
    if (this.markedForDeletion && this.markedForDeletion.length > 0) {
      let idesForDeletion = '';
      this.markedForDeletion.forEach(obj => {
        obj.details.forEach(det => {
          idesForDeletion += det.id + ',';
        });
      });
      idesForDeletion = idesForDeletion.replace(/,\s*$/, '');
      this.delete(idesForDeletion);
    }
    // setTimeout(() => {
    //   window.location.reload();
    // }, 500);
  }

  save(list: TariffDetail[], reload: boolean): void {
    this.service.createTariffDetails(list).subscribe(res => {
      this.notifyService.showSuccess('დამატება დასრულდა წარმატებით', 'ჩანაწერის დამატება');
      if (reload) {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    }, error => {
      this.notifyService.showError('დამატება არ სრულდება', 'ჩანაწერის დამატება');
      console.log(error);
    });
  }

  update(list: TariffDetail[], reload: boolean): void {
    this.service.updateTariffDetails(list).subscribe(res => {
      this.notifyService.showSuccess('განახლება დასრულდა წარმატებით', 'არსებულის განახლება');
      if (reload) {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    }, error => {
      this.notifyService.showError('განახლება არ სრულდება', 'ჩანაწერის განახლება');
      console.log(error);
    });
  }

  delete(ides: string): void {
    this.service.deleteTariffDetails(ides).subscribe(resp => {
      console.log('tariff details with ides: ' + ides + ' deletion response: ', resp);
      // this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', 'ჩანაწერის წაშლა');
    }, error => {
      // this.notifyService.showError('ოპერაცია არ სრულდება', 'ჩანაწერის წაშლა');
      console.log(error);
    });
  }
}
