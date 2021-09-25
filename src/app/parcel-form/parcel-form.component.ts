import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {CityService} from '../services/city.service';
import {ContactService} from '../services/contact.service';
import {City} from '../models/city';
import {Service} from '../models/service';
import {DocType} from '../models/doc-type';
import {CompanyServicesService} from '../services/company-services.service';
import {DoctypesService} from '../services/doctypes.service';
import {Parcel} from '../models/parcel';
import {Contact} from '../models/contact';
import {ContactDTO} from '../models/contact-dto';
import {ContactAddress} from '../models/contact-address';
import {UtilService} from '../services/util.service';
import {ContactAddressService} from '../services/contact-address.service';

@Component({
  selector: 'app-parcel-form',
  templateUrl: './parcel-form.component.html',
  styleUrls: ['./parcel-form.component.scss']
})
export class ParcelFormComponent implements OnInit {
  cities!: City[];
  services!: Service[];
  docTypes!: DocType[];
  selectedObject: Parcel = new Parcel();
  senderContactDto: ContactDTO = new ContactDTO();
  payerContactDto: ContactDTO = new ContactDTO();
  receiverContactDto: ContactDTO = new ContactDTO();
  foundedSenderContact!: Contact;
  foundedReceiverContact!: Contact;
  foundedPayerContact!: Contact;
  foundedSenderContactAddress!: ContactAddress;
  foundedReceiverContactAddress!: ContactAddress;
  foundedPayerContactAddress!: ContactAddress;
  searchedSenderContacts!: Contact[];
  searchedReceiverContacts!: Contact[];
  senderAddresses: ContactAddress[] = [];
  receiverAddresses: ContactAddress[] = [];
  // @ts-ignore
  filteredSenderAddresses: Observable<ContactAddress[]>;
  // @ts-ignore
  filteredReceiverAddresses: Observable<ContactAddress[]>;
  // @ts-ignore
  senderAddressCtrl: FormControl = new FormControl();
  // @ts-ignore
  senderContactPersonCtrl: FormControl = new FormControl();
  // @ts-ignore
  // receiverAddressCtrl: FormControl;

  constructor(private formBuilder: FormBuilder, private cityService: CityService, private utilService: UtilService,
              private contactService: ContactService, private companyServices: CompanyServicesService,
              private contactAddressService: ContactAddressService,
              private docTypeService: DoctypesService) {
  }

  onContactSelect(selectedSenderContactId: number, senderReceiverPayer: number): void {// 1 Sender   2 Reseiver   3 Payer
    //
  }

  onCityChange(cityId: number, senderReceiverPayer: number): void {// 1 Sender   2 Reseiver   3 Payer
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.contactAddressService.getList(100, 0, `city.id=${cityId}&contact.id=${this.senderContactDto.contact.id}`);
        }),
        // tslint:disable-next-line:no-shadowed-variable
        map(data => {
          if (senderReceiverPayer === 1) {
            // @ts-ignore
            this.senderAddresses = data.items;
            console.log(this.senderAddresses);
            this.senderAddressCtrl = new FormControl();
            this.filteredSenderAddresses = this.senderAddressCtrl.valueChanges.pipe(
              startWith(''),
              map(value => this._filter(value, 1))
            );
          } else if (senderReceiverPayer === 2) {
            // @ts-ignore
            // this.receiverAddresses = data.items;
            // this.receiverAddressCtrl = new FormControl();
            // this.filteredSenderAddresses = this.receiverAddressCtrl.valueChanges.pipe(
            //   startWith(''),
            //   map(value => this._filter(value, 2))
            // );
          }
          // @ts-ignore
          return data.items;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => console.log(data));
  }

  searchContact(senderReceiverPayer: number): void {// 1 Sender   2 Reseiver   3 Payer
    // @ts-ignore
    let tmp;
    if (senderReceiverPayer === 1) {
      tmp = {
        name: this.senderContactDto.contact.name,
        identNumber: this.senderContactDto.contact.identNumber
      };
    } else if (senderReceiverPayer === 2) {
      tmp = {
        name: this.receiverContactDto.contact.name,
        identNumber: this.receiverContactDto.contact.identNumber
      };
    }
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          // @ts-ignore
          return this.contactService.getList(10, 0, this.utilService.encode(tmp, ''));
        }),
        map(data => {
          if (senderReceiverPayer === 1) {
            // @ts-ignore
            if (data.items?.length === 1) {
              // @ts-ignore
              this.senderContactDto.contact.id = data.items[0].id;
            } else {
              this.senderContactDto.contact.id = 0;
            }
          } else if (senderReceiverPayer === 2) {
            // @ts-ignore
            if (data.items?.length === 1) {
              // @ts-ignore
              this.receiverContactDto.contact.id = data.items[0].id;
            } else {
              this.receiverContactDto.contact.id = 0;
            }
          }

          // @ts-ignore
          return data.items;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => this.searchedSenderContacts = data);
  }

  private _filter(value: string, senderReceiverPayer: number): ContactAddress[] {
    switch (senderReceiverPayer) {
      case 1:
        return this.senderAddresses.filter(option => option.street.includes(value));
      case 2:
        return this.receiverAddresses.filter(option => option.street.includes(value));
      default:
        return [];
    }
  }

  ngOnInit(): void {
    // for (let i = 0; i < 2; i++) {
    //   const con: ContactAddress = new ContactAddress();
    //   con.street = `${i + 1} რუსთაველის ქუჩა`;
    //   con.appartmentDetails = `ბინა #${i + 10}`;
    //   this.senderAddresses.push(con);
    // }
    //
    // this.senderAddressCtrl = new FormControl();
    // this.filteredSenderAddresses = this.senderAddressCtrl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value, 1))
    // );

    this.getCitiesList();

    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.companyServices.getList(1000, 0, '');
        }),
        map(data => {
          // @ts-ignore
          return data.items;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => this.services = data);

    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.docTypeService.getList(1000, 0, '');
        }),
        map(data => {
          // @ts-ignore
          return data.items;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => this.docTypes = data);
  }

  getCitiesList(): void {
    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.cityService.getList(1000, 0, '');
      }),
      map(data => {
        // @ts-ignore
        return data.items;
      }),
      catchError(() => {
        return observableOf([]);
      })
    ).subscribe(data => {
      this.cities = data;
    });
  }


}
