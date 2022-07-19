import {WayBillType} from './way-bill-type';
import {WayBillStatus} from './way-bill-status';

export class Waybill {
  id!: number;
  rsCreateDate!: string;
  buyerTin!: string;
  buyerName!: string;
  startAddress!: string;
  endAddress!: string;
  driverTin!: string;
  driverName!: string;
  transportCoast!: number;
  status!: WayBillStatus;
  type!: WayBillType;
  activateDate!: string;
  fullAmount!: number;
  carNumber!: string;
  waybillNumber!: string;
  sUserId!: number;
  beginDate!: string;
  waybillComment!: string;
  isConfirmed!: number;
  isCorrected!: number;
  buyerSt!: number;
  syncStatus!: number;
  updatedTime!: string;
  createdTime!: string;
}
