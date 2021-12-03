import {Warehouse} from './warehouse';
import {MessageCc} from './message-cc';
import {User} from './user';

export class Message {
  id!: number;
  deleted!: number;
  to!: Warehouse;
  from!: User;
  updatedTime!: string;
  createdTime!: string;
  cc!: MessageCc[];
  subject!: string;
  comment!: string;
}
