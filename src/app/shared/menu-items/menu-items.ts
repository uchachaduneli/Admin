import {Injectable} from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface Saperator {
  name: string;
  type?: string;
}

export interface SubChildren {
  state: string;
  name: string;
  type?: string;
}

export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
  child?: SubChildren[];
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  saperator?: Saperator[];
  children?: ChildrenItems[];
}

const MENUITEMS = [
  {icon: 'redeem', state: 'parcels', name: 'გზავნილი', type: 'link'},
  {icon: 'file_upload', state: 'excel-import', name: 'გზ. იმპორტი', type: 'link'},
  {icon: 'done_all', state: 'status-manager', name: 'სტატუს მენეჯერი', type: 'link'},
  {icon: 'business', state: 'waybills', name: 'RS', type: 'link'},
  {icon: 'directions_car', state: 'cars', name: 'ავტოპარკი', type: 'link'},
  {icon: 'people_outline', state: 'users', name: 'თანამშრომლები', type: 'link'},
  {icon: 'place', state: 'cities', name: 'ქალაქები', type: 'link'},
  {icon: 'event_note', state: 'delivery-details', name: 'ჩაბარ. დეტალები', type: 'link'},
  {icon: 'device_hub', state: 'bags', name: 'ტვირთ. განაწილ.', type: 'link'},
  {icon: 'perm_contact_calendar', state: 'contacts', name: 'კონტაქტები', type: 'link'},
  {icon: 'map', state: 'routes', name: 'მარშრუტები', type: 'link'},
  {icon: 'bubble_chart', state: 'services', name: 'სერვისები', type: 'link'},
  {icon: 'airport_shuttle', state: 'tranzits', name: 'რეისები', type: 'link'},
  {icon: 'home', state: 'warehouse', name: 'საწყობები', type: 'link'},
  {icon: 'leak_add', state: 'zones', name: 'ზონები', type: 'link'},
  {icon: 'linear_scale', state: 'parcelStatus', name: 'ჩექპოინტები', type: 'link'},
  {icon: 'local_atm', state: 'tariff', name: 'ტარიფები', type: 'link'},
  {icon: 'attach_file', state: 'doctypes', name: 'დოკუმენტის ტიპები', type: 'link'}
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
