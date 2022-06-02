import {Car} from './car';
import {City} from './city';
import {User} from './user';
import {Warehouse} from './warehouse';
import {Bag} from './bag';
import {ParcelStatusReason} from './parcel-status-reason';

export class Tranzit {
  id!: number;
  deleted!: number;
  number!: string;
  car!: Car;
  routeFrom!: City;
  routeTo!: City;
  driver!: User;
  senderWarehouse!: Warehouse;
  destWarehouse!: Warehouse;
  tranzitDate!: string;
  updatedTime!: string;
  createdTime!: string;
  bags: Bag[] = [];
  status!: ParcelStatusReason;

}
