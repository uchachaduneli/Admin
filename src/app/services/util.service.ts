import {Injectable} from '@angular/core';
import {ContactAddress} from '../models/contact-address';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() {
  }

  // encode(queryObj: Object, nesting = ''): string {
  //   const pairs = Object.entries(queryObj).map(([key, val]) => {
  //     if (typeof val === 'object') {
  //       return this.encode(val, nesting + `${key}.`);
  //     } else {
  //       return [nesting + key, val].map(escape).join('=');
  //     }
  //   });
  //   return pairs.join('&');
  // }

  // tslint:disable-next-line:ban-types
  encode(queryObj: Object, nesting = ''): string {
    const pairs = Object.entries(queryObj).map(([key, val]) => {
      if (typeof val === 'object') {
        return this.encode(val, `${key}.`);
      } else {
        return [key, val].join('=');
      }
    });
    console.log('pairs ' + pairs.join('&'));
    return pairs.join('&');
  }
}
