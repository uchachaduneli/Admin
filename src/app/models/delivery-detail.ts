import {Parcel} from './parcel';
import {User} from './user';
import {Warehouse} from './warehouse';
import {Route} from './route';

export class DeliveryDetail {
  id!: number;
  courierOrReception!: number; // 1 courier 2 reception
  carNumber!: string;
  detailBarCode!: string;
  parcelBarCode!: string;
  route!: Route;
  routeId!: number;
  warehouseId!: number;
  warehouse!: Warehouse;
  parcels: Parcel[] = [];
  user!: User;
  userId!: number;
  updatedTime!: string;
  createdTime!: string;
  strCreatedTime!: string;
  strCreatedTimeTo!: string;

}
