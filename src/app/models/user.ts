import {City} from './city';
import {Route} from './route';
import {UserStatus} from './user-status';
import {Role} from './role';
import {Warehouse} from './warehouse';

export class User {
  id!: number;
  deleted!: number;
  name!: string;
  userName!: string;
  password!: string;
  changePass!: boolean;
  lastName!: string;
  phone!: string;
  personalNumber!: string;
  city!: City;
  route!: Route;
  warehouse!: Warehouse;
  role!: Role[];
  status!: UserStatus;
  updatedTime!: string;
  createdTime!: string;
  token!: string;
}
