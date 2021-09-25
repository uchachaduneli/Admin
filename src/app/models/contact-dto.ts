import {Contact} from './contact';
import {ContactAddress} from './contact-address';
import {City} from './city';

export class ContactDTO {
  contact: Contact = new Contact();
  contactAddress: ContactAddress = new ContactAddress();

  constructor() {
    this.contactAddress.city = new City();
  }
}
