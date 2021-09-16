import {Tariff} from './tariff';
import {Zone} from './zone';

export class TariffDetail {
  id!: number;
  deleted!: number;
  tariff!: Tariff;
  weight!: number;
  price!: number;
  zone!: Zone;
  updatedTime!: string;
  createdTime!: string;

  constructor(price: number, zone: Zone) {
    this.price = price;
    this.zone = zone;
  }
}
