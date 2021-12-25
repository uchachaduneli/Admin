import {Warehouse} from './warehouse';
import {MessageCc} from './message-cc';
import {User} from './user';
import {Parcel} from './parcel';

export class Message {
  id!: number;
  deleted!: number;
  to!: Warehouse;
  author!: User;
  updatedTime!: string;
  createdTime!: string;
  cc: MessageCc[] = [];
  subject!: string;
  msg!: string;
  parcel!: Parcel;
}
