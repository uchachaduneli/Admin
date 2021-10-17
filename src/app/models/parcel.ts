import {Service} from './service';
import {DocType} from './doc-type';
import {ParcelStatus} from './parcel-status';
import {City} from './city';
import {Route} from './route';
import {User} from './user';

export class Parcel {
  id!: number;
  deleted!: number;
  status!: ParcelStatus;
  updatedTime!: string;
  createdTime!: string;

  senderName!: string;
  senderIdentNumber!: string;
  senderContactPerson!: string;
  senderAddress!: string;
  senderCity!: City;
  senderPhone!: string;

  receiverName!: string;
  receiverIdentNumber!: string;
  receiverContactPerson!: string;
  receiverAddress!: string;
  receiverCity!: City;
  receiverPhone!: string;

  payerSide!: number; // 1 sender  2 receiver  3 third person
  payerName!: string;
  payerIdentNumber!: string;
  payerAddress!: string;
  payerCity!: City;
  payerContactPerson!: string;
  payerPhone!: string;

  comment!: string;
  deliveredConfirmation!: number;
  count!: number;
  weight!: number;
  volumeWeight!: number;
  gadafutvisPrice!: number;
  totalPrice!: number;
  deliveryType!: number; // 1 mitana misamartze, 2 mikitxva filialshi
  paymentType!: number; // 1 invoice, 2 cash, 3 card
  parcelType: Service = new Service();
  packageType!: number;  // 1 amanati, 2 paketi
  sticker: DocType = new DocType();
  route: Route = new Route();
  courier: User = new User();
  content!: string;
}
