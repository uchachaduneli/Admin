import {Contact} from './contact';
import {City} from './city';
import {DocType} from './doc-type';
import {Route} from './route';
import {User} from './user';

export class ExcelTmpParcel {
  id!: number;
  barCode!: string;
  tmpIdForPerExcel!: number;
  sender!: Contact;
  receiverName!: string;
  receiverIdentNumber!: string;
  receiverContactPerson!: string;
  receiverAddress!: string;
  receiverPhone!: string;
  receiverCity!: City;
  comment!: string;
  count!: number;
  weight!: number;
  totalPrice!: number;
  stiker!: DocType;
  route!: Route;
  author!: User;
  content!: string;
  updatedTime!: string;
  createdTime!: string;
}
