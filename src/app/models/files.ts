import {Parcel} from './parcel';
import {User} from './user';
import {Warehouse} from './warehouse';

export class Files {
  id!: number;
  deleted!: number;
  name!: string;
  author!: User;
  warehouse!: Warehouse;
  url!: string;
  parcel!: Parcel;
  updatedTime!: string;
  createdTime!: string;
}
