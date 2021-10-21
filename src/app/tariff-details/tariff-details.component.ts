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

  constructor(private route: ActivatedRoute, private router: Router, private zoneService: ZoneService, private cdr: ChangeDetectorRef,
              private service: TariffService, private notifyService: NotificationService, private utilService: UtilService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.service.getById(params.id).subscribe(tariff => {
        if (!tariff) {
          this.router.navigate(['tariff']);
        }
        // @ts-ignore
        this.mainObj = tariff;
        this.getMainData();
        this.getZones();
      });
    });
  }

  ngAfterViewInit(): void {

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
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          // @ts-ignore
          return this.service.getByTariffId(this.mainObj.id);
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
    console.log(this.tarifByZones);
    // @ts-ignore
    const tariffDetailsArr: TariffDetail[] = [];
    this.tarifByZones.forEach(tz => {
      tz.details.forEach(det => {
        // @ts-ignore
        tariffDetailsArr.push({id: det.id, tariff: {id: this.mainObj.id}, weight: tz.weight, price: det.price, zone: {id: det.zone.id}});
      });
    });
    console.log(tariffDetailsArr);
    const forSave = tariffDetailsArr.filter(t => t.id === undefined || t.id === 0);
    const forUpdate = tariffDetailsArr.filter(t => t.id !== undefined && t.id > 0);
    if (forSave && forSave.length > 0) {
      this.save(forSave, !(forUpdate && forUpdate.length > 0));
    }
    if (forUpdate && forUpdate.length > 0) {
      this.update(forUpdate, true);
    }
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

  delete(obj: TariffDetail): void {
    this.service.deleteTariffDetails(obj.id).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', 'ჩანაწერის წაშლა');
      window.location.reload();
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', 'ჩანაწერის წაშლა');
      console.log(error);
    });
  }
}
