import {Warehouse} from './warehouse';
import {Parcel} from './parcel';
import {ParcelStatusReason} from './parcel-status-reason';

export class Bag {
  id!: number;
  barCode!: string;
  from!: Warehouse;
  to!: Warehouse;
  status!: ParcelStatusReason;
  parcels: Parcel[] = [];
  updatedTime!: string;
  createdTime!: string;
}
