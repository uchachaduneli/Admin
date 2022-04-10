import {ParcelStatusReason} from './parcel-status-reason';

export class DeliveryDetailParcelDTO {
  deliveryTime!: string;
  receiverName!: string;
  receiverIdentNumber!: string;
  status: ParcelStatusReason = new ParcelStatusReason();
  id!: number;

  constructor(deliveryTime: string, receiverName: string, receiverIdentNumber: string, status: ParcelStatusReason, id: number) {
    this.deliveryTime = deliveryTime;
    this.receiverName = receiverName;
    this.receiverIdentNumber = receiverIdentNumber;
    this.status = status;
    this.id = id;
  }
}
