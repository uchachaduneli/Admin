export class ParcelDTO {
  id!: number;
  deleted!: number;
  // 1 - pre inserted with empty values, will be filled after some time
  prePrinted!: number;
  barCode!: string;

  senderId!: number;
  senderName!: string;
  senderIdentNumber!: string;
  senderContactPerson!: string;
  senderAddress!: string;
  senderPhone!: string;
  senderCityId!: number;
  sendSmsToSender!: number;

  receiverId!: number;
  receiverName!: string;
  receiverIdentNumber!: string;
  receiverContactPerson!: string;
  receiverAddress!: string;
  receiverPhone!: string;
  receiverCityId!: number;
  sendSmsToReceiver!: number;

  deliveredToPers!: string;
  deliveredToPersIdent!: string;
  deliveredToPersRelativeLevel!: string;
  deliveredToPersNote!: string;
  deliveredToPersSignature!: string;
  deliveredParcelimage!: string;

  payerId!: number;
  payerSide!: number; // 1 sender  2 receiver   3 third side
  payerName!: string;
  payerIdentNumber!: string;
  payerAddress!: string;
  payerPhone!: string;
  payerContactPerson!: string;
  payerCityId!: number;

  addedFromGlobal!: boolean;

  statusId!: number;
  statusReasonId!: number;
  statusNote!: string; // insert/update operations ar made from deliveryDetails Page
//     Date statusDateTime; //xelit sheyavt statusebismenejeris feijze

  comment!: string;
  deliveredConfirmation!: number; // 1 yes 2 no
  count!: number;
  weight!: number;
  weightTo!: number;
  volumeWeight!: number;
  volumeWeightTo!: number;
  gadafutvisPrice!: number;
  totalPrice!: number;
  totalPriceTo!: number;
  deliveryType!: number; // 1 mitana misamartze, 2 mikitxva filialshi
  paymentType!: number; // 1 invoice, 2 cash, 3 card
  serviceId!: number;
  packageType!: number; // 1 amanati, 2 paketi
  routeId!: number;
  courierId!: number;
  authorId!: number;

  tariff!: number;
  content!: string;
  deliveryTime!: string;
  deliveryTimeTo!: string;
  createdTime!: string;
  createdTimeTo!: string;
}
