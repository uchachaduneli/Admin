import {Zone} from './zone';

export class City {
  id!: number;
  name!: string;
  code!: string;
  deleted!: number;
  zone!: Zone;
  updatedTime!: string;
  createdTime!: string;
}
