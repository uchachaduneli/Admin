import {Parcel} from './parcel';

export class InvoiceDTO {
  id!: number;
  name!: string;
  identNumber!: string;
  status!: string;
  payStatus!: string;
  pdf!: string;
  operationDate!: string;
  operationDateTo!: string;
  strOperationDate!: string;
  strOperationDateTo!: string;
  parcels: Parcel[] = [];
  parcelsCount!: number;
}
