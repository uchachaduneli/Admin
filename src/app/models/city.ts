import {Zone} from './zone';

export class City {
  id: number;
  name: string;
  code: string;
  zone: Zone;
  updatedTime: string;
  createdTime: string;

  constructor(id: number, name: string, code: string, zone: Zone, updatedTime: string, createdTime: string) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.zone = zone;
    this.updatedTime = updatedTime;
    this.createdTime = createdTime;
  }
}
