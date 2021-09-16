import {TariffDetail} from './tariff-detail';

export class TariffByZone {
  weight!: number;
  details!: TariffDetail[];

  constructor(weight: number, details: TariffDetail[]) {
    this.weight = weight;
    this.details = details;
  }
}
