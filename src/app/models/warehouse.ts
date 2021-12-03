import {City} from './city';

export class Warehouse {
  id!: number;
  deleted!: number;
  name!: string;
  abbreviature!: string;
  city!: City;
  updatedTime!: string;
  createdTime!: string;
}
