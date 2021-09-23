import {Contact} from './contact';
import {Service} from './service';
import {DocType} from './doc-type';
import {ParcelStatus} from './parcel-status';

export class Parcel {
  id!: number;
  deleted!: number;
  status!: ParcelStatus;
  updatedTime!: string;
  createdTime!: string;
  sender!: Contact;
  receiver!: Contact;
  payer!: Contact;
  comment!: string;
  deliveredConfirmation!: number;
  count!: number;
  weight!: number;
  volumeWeight!: number;
  gadafutvisPrice!: number;
  totalPrice!: number;
  deliveryType!: number; // 1 mitana misamartze, 2 mikitxva filialshi
  paymentType!: number; // 1 invoice, 2 cash, 3 card
  parcelType!: Service;
  packageType!: number;  // 1 amanati, 2 paketi
  sticker!: DocType;
  content!: string;
}
