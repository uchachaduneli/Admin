import {Packages} from './packages';
import {Parcel} from './parcel';

export class ParcelWithPackagesDTO {
  parcel!: Parcel;
  packages!: Packages[];
}
