import {Parcel} from './parcel';

export class InvoiceDTO {
  id!: number;
  name!: string;
  identNumber!: string;
  emailToSent!: string;
  status!: string;
  payStatus!: string;
  newAmount!: number;
  payedAmount!: number;
  amount!: number; // calculated during select
  parcelsCount!: number; // parcels count - calculated during select
  pdf!: string;
  operationDate!: string;
  operationDateTo!: string;
  strOperationDate!: string;
  strOperationDateTo!: string;
  parcels: Parcel[] = [];
}
