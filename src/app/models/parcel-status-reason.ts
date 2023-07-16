import {ParcelStatus} from './parcel-status';

export class ParcelStatusReason {
  id!: number;
  name!: string;
  status!: ParcelStatus;
  updatedTime!: string;
  createdTime!: string;
  showInMobail!: boolean;
}
