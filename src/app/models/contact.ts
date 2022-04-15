import {User} from './user';
import {Tariff} from './tariff';
import {ContactAddress} from './contact-address';

export class Contact {
  id!: number;
  deleted!: number;
  name!: string;
  email!: string;
  type!: number;
  status!: number;
  deReGe!: number;
  hasContract!: number;
  identNumber!: string;
  user!: User;
  tariff!: Tariff;
  updatedTime!: string;
  createdTime!: string;
}
