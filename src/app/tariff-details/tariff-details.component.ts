import {AfterViewInit, Component, OnInit} from '@angular/core';
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

  constructor(private route: ActivatedRoute, private router: Router, private zoneService: ZoneService,
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

  onSubmit(): void {
    console.log(this.tarifByZones);
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
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          // @ts-ignore
          return this.service.getByTariffId(this.mainObj.id);
        }),
        map(data => {
          // @ts-ignore
          this.resultsLength = data.total_count;
          // @ts-ignore
          return data.items;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => this.tariffDetails = data);
  }

  save(obj: TariffDetail): void {
    // @ts-ignore
    obj.tariff = {id: this.mainObj.tariff.id}; // set tariff With Id Retrieved From URL
    this.service.createTariffDetails(obj).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', 'ჩანაწერის დამატება');
      window.location.reload();
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', 'ჩანაწერის დამატება');
      console.log(error);
    });
  }

  update(obj: TariffDetail): void {
    // @ts-ignore
    obj.tariff = {id: this.mainObj.tariff.id}; // set tariff With Id Retrieved From URL
    this.service.updateTariffDetails(obj).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', 'ჩანაწერის განახლება');
      window.location.reload();
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', 'ჩანაწერის განახლება');
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
