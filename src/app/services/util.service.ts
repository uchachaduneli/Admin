import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() {
  }

  // tslint:disable-next-line:ban-types
  encode(queryObj: any): string {
    let encodedStr = '';
    Object.keys(queryObj).map((key) => {
      // console.log('started for: ', key, ' = ', queryObj[key]);
      if (Array.isArray(queryObj[key]) && Array.from(queryObj[key]).length > 0) {
        // prop is array
        encodedStr += '&' + key + '=';
        for (const r of Array.from(queryObj[key])) {
          encodedStr += r + ',';
        }
        encodedStr = encodedStr.replace(/,\s*$/, '');
      } else if (typeof queryObj[key] === 'object') {
        // prop is nested obj
        const subObj = queryObj[key];
        Object.keys(subObj).map((subKey) => {
          // sub object must be just ordinary prop type not object or array
          if (typeof subObj[subKey] !== 'object' && !Array.isArray(subObj[subKey])) {
            encodedStr += '&' + key + '.' + subKey + '=' + subObj[subKey];
          }
        });
      } else {
        // prop has simple type
        encodedStr += '&' + [key, queryObj[key]].join('=');
      }
    });
    return encodedStr;
  }
}
