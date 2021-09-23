import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {merge, of as observableOf} from 'rxjs';
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

@Component({
  selector: 'app-parcel-form',
  templateUrl: './parcel-form.component.html',
  styleUrls: ['./parcel-form.component.scss']
})
export class ParcelFormComponent implements OnInit {

  // firstFormGroup: FormGroup = Object.create(null);
  // secondFormGroup: FormGroup = Object.create(null);
  cities!: City[];
  services!: Service[];
  docTypes!: DocType[];
  selectedObject!: Parcel;
  senderContact: ContactDTO = new ContactDTO();
  payerContact: ContactDTO = new ContactDTO();
  receiverContact: ContactDTO = new ContactDTO();
  foundedSenderContact!: Contact;
  foundedReceiverContact!: Contact;
  foundedPayerContact!: Contact;
  foundedSenderContactAddress!: ContactAddress;
  foundedReceiverContactAddress!: ContactAddress;
  foundedPayerContactAddress!: ContactAddress;

  constructor(private formBuilder: FormBuilder, private cityService: CityService,
              private contactService: ContactService, private companyServices: CompanyServicesService,
              private docTypeService: DoctypesService) {
  }

  ngOnInit(): void {
    // this.firstFormGroup = this.formBuilder.group({
    //   firstCtrl: ['', Validators.required]
    // });
    // this.secondFormGroup = this.formBuilder.group({
    //   secondCtrl: ['', Validators.required]
    // });

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
        console.log(data.items);
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
