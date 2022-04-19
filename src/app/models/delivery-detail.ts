import {Parcel} from './parcel';
import {User} from './user';
import {Warehouse} from './warehouse';
import {Route} from './route';

export class DeliveryDetail {
  id!: number;
  detailBarCode!: string;
  route!: Route;
  warehouse!: Warehouse;
  parcels: Parcel[] = [];
  user!: User;
  updatedTime!: string;
  createdTime!: string;
}
