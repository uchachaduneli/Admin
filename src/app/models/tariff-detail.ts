import {Tariff} from './tariff';
import {Zone} from './zone';
import {Service} from './service';

export class TariffDetail {
  id!: number;
  deleted!: number;
  tariff!: Tariff;
  weight!: number;
  price!: number;
  zone!: Zone;
  service!: Service;
  updatedTime!: string;
  createdTime!: string;

  constructor(price: number, zone: Zone) {
    this.price = price;
    this.zone = zone;
  }
}
