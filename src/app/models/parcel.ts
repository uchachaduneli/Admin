import {Service} from './service';
import {City} from './city';
import {Route} from './route';
import {User} from './user';
import {ParcelStatusReason} from './parcel-status-reason';
import {Packages} from './packages';

export class Parcel {
  id!: number;
  barCode!: string;
  deleted!: number;
  status!: ParcelStatusReason;
  updatedTime!: string;
  createdTime!: string;

  senderId!: number;
  senderName!: string;
  senderIdentNumber!: string;
  senderContactPerson!: string;
  senderAddress!: string;
  senderCity!: City;
  senderPhone!: string;
  sendSmsToSender!: number;

  receiverName!: string;
  receiverIdentNumber!: string;
  receiverContactPerson!: string;
  receiverAddress!: string;
  receiverCity!: City;
  receiverPhone!: string;
  sendSmsToReceiver!: number;

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
  // parcelType: Service = new Service();
  packageType!: number;  // 1 amanati, 2 paketi
  route: Route = new Route();
  courier: User = new User();
  service: Service = new Service();
  content!: string;
  tariff!: number;
}
