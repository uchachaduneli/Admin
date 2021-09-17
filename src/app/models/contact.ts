import {User} from './user';

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
  updatedTime!: string;
  createdTime!: string;

}
