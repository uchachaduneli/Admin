import {Contact} from './contact';
import {ContactAddress} from './contact-address';
import {City} from './city';

export class ContactDTO {
  contact: Contact = new Contact();
  contactAddress: ContactAddress = new ContactAddress();
  payerSide!: number; // 1 sender 2 receiver 3 third side

  constructor() {
    this.contactAddress.city = new City();
  }
}
