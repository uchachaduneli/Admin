import {Parcel} from './parcel';
import {User} from './user';
import {Warehouse} from './warehouse';

export class ParcelStatusHistory {
  id!: number;
  name!: string;
  reason!: string;
  code!: string;
  reasonCode!: string;
  parcel!: Parcel;
  author!: User;
  courierUser!: User;
  operUSer!: User;
  warehouse!: Warehouse;
  comment!: string;
  updatedTime!: string;
  createdTime!: string;
  statusDateTime!: string;
}
