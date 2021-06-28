import {Contact} from "./contact";
import {City} from "./city";

export class ContactAddress {
  id: number
  contact: Contact
  city: City
  postCode: string
  street: string
  appartmentDetails: string
  contactPerson: string
  contactPersonPhone: string
  contactPersonEmail: string
  updatedTime: string
  createdTime: string
}
