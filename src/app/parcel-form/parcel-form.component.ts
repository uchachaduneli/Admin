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
import {Packages} from '../models/packages';
import {VolumeWeightIndex} from '../models/volume-weight-index';
import {ParcelService} from '../services/parcel.service';
import {NotificationService} from '../services/notification.service';
import {Route} from '../models/route';
import {RouteService} from '../services/route.service';
import {MatStepper} from '@angular/material/stepper';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-parcel-form',
  templateUrl: './parcel-form.component.html',
  styleUrls: ['./parcel-form.component.scss']
})
export class ParcelFormComponent implements OnInit {
  cities!: City[];
  services!: Service[];
  routes!: Route[];
  docTypes!: DocType[];
  selectedObject: Parcel = new Parcel();
  senderContactDto: ContactDTO = new ContactDTO();
  payerContactDto: ContactDTO = new ContactDTO();
  receiverContactDto: ContactDTO = new ContactDTO();
  foundedSenderContactAddress!: ContactAddress;
  searchedSenderContacts!: Contact[];
  searchedReceiverContacts!: Contact[];
  searchedPayerContacts!: Contact[];
  senderAddresses: ContactAddress[] = [];
  receiverAddresses: ContactAddress[] = [];
  senderContactPersons: ContactAddress[] = [];
  receiverContactPersons: ContactAddress[] = [];
  // @ts-ignore
  filteredSenderAddresses: Observable<ContactAddress[]>;
  // @ts-ignore
  filteredSenderContactPersons: Observable<ContactAddress[]>;
  // @ts-ignore
  filteredSenderContacts: Observable<ContactAddress[]>;
  // @ts-ignore
  filteredReceiverAddresses: Observable<ContactAddress[]>;
  // @ts-ignore
  filteredReceiverContactPersons: Observable<ContactAddress[]>;
  // @ts-ignore
  senderAddressCtrl: FormControl = new FormControl();
  // @ts-ignore
  senderContactPersonCtrl: FormControl = new FormControl();
  // @ts-ignore
  receiverContactPersonCtrl: FormControl = new FormControl();
  // @ts-ignore
  receiverAddressCtrl: FormControl = new FormControl();

  dynamicArray: Array<Packages> = [];

  slctedVolumeWeightIndex: VolumeWeightIndex = new VolumeWeightIndex();

  packagesCount!: number;

  constructor(private formBuilder: FormBuilder, private cityService: CityService, private utilService: UtilService,
              private contactService: ContactService, private companyServices: CompanyServicesService, private routeService: RouteService,
              private contactAddressService: ContactAddressService, private service: ParcelService,
              private notifyService: NotificationService, private route: ActivatedRoute, private router: Router,
              private docTypeService: DoctypesService) {
  }

  validateNextStep(i: number, stepper: MatStepper): void {
    if (i === 1) {
      if (!this.senderContactDto.contact.id && !this.senderContactDto.contact.identNumber) {
        this.notifyService.showError('გთხოვთ მიუთითეთ გამგზავნის შესახებ ინფორმაცია', '');
      } else if (!this.senderContactDto.contactAddress.city.id) {
        this.notifyService.showError('გთხოვთ მიუთითეთ ქალაქი გამგზავნის ბლოკში', '');
      } else if (this.senderAddressCtrl.value === null || this.senderAddressCtrl.value.length < 1) {
        this.notifyService.showError('გთხოვთ მიუთითეთ მისამართი გამგზავნის ბლოკში', '');
      } else if (this.senderContactPersonCtrl.value === null || this.senderContactPersonCtrl.value.length < 1) {
        this.notifyService.showError('გთხოვთ მიუთითეთ საკონტაქტო პირი გამგზავნის ბლოკში', '');
      } else {
        stepper.next();
      }
    } else if (i === 2) {
      if (!this.receiverContactDto.contact.id && !this.receiverContactDto.contact.identNumber) {
        this.notifyService.showError('გთხოვთ მიუთითეთ მიმღების შესახებ ინფორმაცია', '');
      } else if (!this.receiverContactDto.contactAddress.city.id) {
        this.notifyService.showError('გთხოვთ მიუთითეთ ქალაქი მიმღების ბლოკში', '');
      } else if (this.receiverAddressCtrl.value === null || this.receiverAddressCtrl.value.length < 1) {
        this.notifyService.showError('გთხოვთ მიუთითეთ მისამართი მიმღების ბლოკში', '');
      } else if (this.receiverContactPersonCtrl.value === null || this.receiverContactPersonCtrl.value.length < 1) {
        this.notifyService.showError('გთხოვთ მიუთითეთ საკონტაქტო პირი მიმღების ბლოკში', '');
      } else {
        stepper.next();
      }
    } else if (i === 3) {
      if (!this.selectedObject.payerSide) {
        this.notifyService.showError('გთხოვთ მიუთითოთ გადამხდელი მხარე (გამგზავნი/მიმღები/მესამე პირი)', '');
      }
      if (this.selectedObject.payerSide === 3) {
        if (!this.payerContactDto.contact.id && !this.payerContactDto.contact.identNumber) {
          this.notifyService.showError('გთხოვთ მიუთითეთ გადამხდელის შესახებ ინფორმაცია', '');
        } else if (!this.payerContactDto.contactAddress.city.id) {
          this.notifyService.showError('გთხოვთ მიუთითეთ ქალაქი გადამხდელის ბლოკში', '');
        } else if (!this.payerContactDto.contactAddress.street || this.payerContactDto.contactAddress.street.length < 1) {
          this.notifyService.showError('გთხოვთ მიუთითეთ მისამართი გადამხდელის ბლოკში', '');
        } else if (!this.payerContactDto.contactAddress.contactPerson || this.payerContactDto.contactAddress.contactPerson.length < 1) {
          this.notifyService.showError('გთხოვთ მიუთითეთ საკონტაქტო პირი გადამხდელის ბლოკში', '');
        } else {
          stepper.next();
        }
      } else {
        stepper.next();
      }
    }
  }

  validateBeforeSave(): boolean {
    // sender
    if (!this.senderContactDto.contact.id && !this.senderContactDto.contact.identNumber) {
      this.notifyService.showError('გთხოვთ მიუთითეთ გამგზავნის შესახებ ინფორმაცია', '');
      return false;
    } else if (!this.senderContactDto.contactAddress.city.id) {
      this.notifyService.showError('გთხოვთ მიუთითეთ ქალაქი გამგზავნის ბლოკში', '');
      return false;
    } else if (this.senderAddressCtrl.value === null || this.senderAddressCtrl.value.length < 1) {
      this.notifyService.showError('გთხოვთ მიუთითეთ მისამართი გამგზავნის ბლოკში', '');
      return false;
    } else if (this.senderContactPersonCtrl.value === null || this.senderContactPersonCtrl.value.length < 1) {
      this.notifyService.showError('გთხოვთ მიუთითეთ საკონტაქტო პირი გამგზავნის ბლოკში', '');
      return false;
    }
    // receiver
    if (!this.receiverContactDto.contact.id && !this.receiverContactDto.contact.identNumber) {
      this.notifyService.showError('გთხოვთ მიუთითეთ მიმღების შესახებ ინფორმაცია', '');
      return false;
    } else if (!this.receiverContactDto.contactAddress.city.id) {
      this.notifyService.showError('გთხოვთ მიუთითეთ ქალაქი მიმღების ბლოკში', '');
      return false;
    } else if (this.receiverAddressCtrl.value === null || this.receiverAddressCtrl.value.length < 1) {
      this.notifyService.showError('გთხოვთ მიუთითეთ მისამართი მიმღების ბლოკში', '');
      return false;
    } else if (this.receiverContactPersonCtrl.value === null || this.receiverContactPersonCtrl.value.length < 1) {
      this.notifyService.showError('გთხოვთ მიუთითეთ საკონტაქტო პირი მიმღების ბლოკში', '');
      return false;
    }
    // payer
    if (this.selectedObject.payerSide === 3) {
      if (!this.payerContactDto.contact.id && !this.payerContactDto.contact.identNumber) {
        this.notifyService.showError('გთხოვთ მიუთითეთ გადამხდელის შესახებ ინფორმაცია', '');
        return false;
      } else if (!this.payerContactDto.contactAddress.city.id) {
        this.notifyService.showError('გთხოვთ მიუთითეთ ქალაქი გადამხდელის ბლოკში', '');
        return false;
      } else if (!this.payerContactDto.contactAddress.street || this.payerContactDto.contactAddress.street.length < 1) {
        this.notifyService.showError('გთხოვთ მიუთითეთ მისამართი გადამხდელის ბლოკში', '');
        return false;
      } else if (!this.payerContactDto.contactAddress.contactPerson || this.payerContactDto.contactAddress.contactPerson.length < 1) {
        this.notifyService.showError('გთხოვთ მიუთითეთ საკონტაქტო პირი გადამხდელის ბლოკში', '');
        return false;
      }
    }
    // parcel
    if (!this.packagesCount || this.packagesCount === 0) {
      this.notifyService.showError('გთხოვთ მიუთითეთ ამანათის რაოდენობა', '');
      return false;
    } else if (!this.selectedObject.weight || this.selectedObject.weight === 0) {
      this.notifyService.showError('გთხოვთ მიუთითეთ ამანათის წონა', '');
      return false;
    } else if (!this.selectedObject.gadafutvisPrice) {
      this.notifyService.showError('გთხოვთ მიუთითეთ გადაფუთვის ფასი', '');
      return false;
    } else if (!this.selectedObject.deliveryType) {
      this.notifyService.showError('გთხოვთ მიუთითეთ ჩაბარების ტიპი', '');
      return false;
    } else if (!this.selectedObject.paymentType) {
      this.notifyService.showError('გთხოვთ მიუთითეთ გადახდის ტიპი', '');
      return false;
    } else if (!this.selectedObject.packageType) {
      this.notifyService.showError('გთხოვთ მიუთითეთ პაკეტის ტიპი', '');
      return false;
    } else if (!this.selectedObject.parcelType.id) {
      this.notifyService.showError('გთხოვთ მიუთითეთ გზავნილის ტიპი', '');
      return false;
    } else if (!this.selectedObject.route.id) {
      this.notifyService.showError('გთხოვთ მიუთითეთ მარშრუტი', '');
      return false;
    } else if (!this.selectedObject.sticker.id) {
      this.notifyService.showError('გთხოვთ მიუთითეთ სტიკერი', '');
      return false;
    }
    return true;
  }

  save(): void {
    if (this.validateBeforeSave()) {
      // set senders data
      this.selectedObject.senderName = this.senderContactDto.contact.name;
      this.selectedObject.senderIdentNumber = this.senderContactDto.contact.identNumber;
      this.selectedObject.senderAddress = this.senderAddressCtrl.value;
      this.selectedObject.senderContactPerson = this.senderContactPersonCtrl.value;
      // @ts-ignore
      this.selectedObject.senderCity = {id: this.senderContactDto.contactAddress.city.id};

      // set senders data
      this.selectedObject.receiverName = this.receiverContactDto.contact.name;
      this.selectedObject.receiverIdentNumber = this.receiverContactDto.contact.identNumber;
      this.selectedObject.receiverAddress = this.receiverAddressCtrl.value;
      this.selectedObject.receiverContactPerson = this.receiverContactPersonCtrl.value;
      // @ts-ignore
      this.selectedObject.receiverCity = {id: this.receiverContactDto.contactAddress.city.id};

      // set payers data
      if (this.selectedObject.payerSide === 1) { // when sender pays
        this.selectedObject.payerName = this.senderContactDto.contact.name;
        this.selectedObject.payerIdentNumber = this.senderContactDto.contact.identNumber;
        this.selectedObject.payerAddress = this.senderAddressCtrl.value;
        this.selectedObject.payerContactPerson = this.senderContactPersonCtrl.value;
        // @ts-ignore
        this.selectedObject.payerCity = {id: this.senderContactDto.contactAddress.city.id};
      } else if (this.selectedObject.payerSide === 2) {// when receiver pays
        this.selectedObject.payerName = this.receiverContactDto.contact.name;
        this.selectedObject.payerIdentNumber = this.receiverContactDto.contact.identNumber;
        this.selectedObject.payerAddress = this.receiverAddressCtrl.value;
        this.selectedObject.payerContactPerson = this.receiverContactPersonCtrl.value;
        // @ts-ignore
        this.selectedObject.payerCity = {id: this.receiverContactDto.contactAddress.city.id};
      } else if (this.selectedObject.payerSide === 3) { // when third person pays
        this.selectedObject.payerName = this.payerContactDto.contact.name;
        this.selectedObject.payerIdentNumber = this.payerContactDto.contact.identNumber;
        this.selectedObject.payerAddress = this.payerContactDto.contactAddress.street;
        this.selectedObject.payerContactPerson = this.payerContactDto.contactAddress.contactPerson;
        // @ts-ignore
        this.selectedObject.payerCity = {id: this.payerContactDto.contactAddress.city.id};
      }

      // set parcel data
      this.selectedObject.count = this.packagesCount;


      merge()
        .pipe(
          startWith({}),
          switchMap(() => {
            return this.service.create(this.selectedObject);
          }),
          map(data => {
            this.notifyService.showSuccess('ამანათის ინფორმაცია შენახულია', '');
            // @ts-ignore
            this.saveParcelPackages(data.id);
            // @ts-ignore
            return data;
          }),
          catchError(error => {
            this.notifyService.showError('მონაცემების შენახვა ვერ მოხერხდა', '');
            console.log(error);
            return observableOf([]);
          })
        ).subscribe(data => {
        console.log(data);
        // @ts-ignore
        this.selectedObject = data;
        // if (!data && data.id > 0) {
        //
        // }
      });

    } else {
      console.log('fields validation failed During Saving Parcel');
    }
  }

  saveParcelPackages(id: number): void {
    this.dynamicArray.forEach(e => {
      // @ts-ignore
      e.parcel = {id};
    });
    this.service.createPackages(this.dynamicArray).subscribe(res => {
      console.log('saved Packages ');
      console.log(res);
    }, error => {
      this.notifyService.showError('ამანათის პაკეტების შენახვისას დაფიქსირდა შეცდომა', '');
      console.log(error);
    });
  }

  calculateVolumeWeight(i: number): void {
    if (this.dynamicArray[i].length && this.dynamicArray[i].width && this.dynamicArray[i].height) {
      const p: Packages = this.dynamicArray[i];
      p.volumeWeight =
        (this.dynamicArray[i].length
          * this.dynamicArray[i].width
          * this.dynamicArray[i].height) / this.slctedVolumeWeightIndex.amount;
      this.dynamicArray[i] = p;
      this.calculateTotalVolumeWeigh();
    }
  }

  calculateTotalVolumeWeigh(): void {
    let totalVolumeWeight = 0;
    // tslint:disable-next-line:prefer-for-of
    for (let j = 0; j < this.dynamicArray.length; j++) {
      totalVolumeWeight += this.dynamicArray[j].volumeWeight;
    }
    this.selectedObject.volumeWeight = totalVolumeWeight;
  }

  deletePackageRow(i: number): void {
    this.dynamicArray.splice(i, 1);
    this.calculateTotalVolumeWeigh();
  }

  addPackageRow(rowCout: number): void {
    if (rowCout < 0) {
      this.dynamicArray.push(new Packages());
    } else {
      this.dynamicArray = [];
      for (let i = 0; i < rowCout; i++) {
        this.dynamicArray.push(new Packages());
      }
    }
  }

  saveGlobalVolumeWeight(): void {
    this.service.updateVolumeWeightIndex(this.slctedVolumeWeightIndex).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', '');
      window.location.reload();
    }, error => {
      this.notifyService.showError(!!error.error ? error.error : 'ოპერაცია არ სრულდება', 'მოცულობითი წონის კოეფიციენტის განახლება');
      console.log(error);
    });
  }

  resetFilters(): void {
    window.location.reload();
  }

  onContactSelect(selectedSenderContactId: number, senderReceiverPayer: number): void {// 1 Sender   2 Reseiver   3 Payer
    //
  }

  onCityChange(cityId: number, senderReceiverPayer: number): void {// 1 Sender   2 Reseiver   3 Payer
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          if (senderReceiverPayer === 1) {
            return this.contactAddressService.getList(100, 0, `city.id=${cityId}`
              + (this.senderContactDto.contact?.id ? '&contact.id=' + this.senderContactDto.contact.id : ''));
          } else {
            return this.contactAddressService.getList(100, 0, `city.id=${cityId}`
              + (this.receiverContactDto.contact?.id ? '&contact.id=' + this.receiverContactDto.contact.id : ''));
          }
        }),
        // tslint:disable-next-line:no-shadowed-variable
        map(data => {
          // @ts-ignore
          return data.items;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => {
      if (senderReceiverPayer === 1) {
        this.senderAddresses = data;
        this.senderAddressCtrl = new FormControl();
        this.filteredSenderAddresses = this.senderAddressCtrl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value, 1, 1))
        );
        this.senderContactPersons = data;
        this.senderContactPersonCtrl = new FormControl();
        this.filteredSenderContactPersons = this.senderContactPersonCtrl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value, 1, 2))
        );
      } else if (senderReceiverPayer === 2) {
        this.receiverAddresses = data;
        this.receiverAddressCtrl = new FormControl();
        this.filteredReceiverAddresses = this.receiverAddressCtrl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value, 2, 1))
        );
        this.receiverContactPersons = data;
        this.receiverContactPersonCtrl = new FormControl();
        this.filteredReceiverContactPersons = this.receiverContactPersonCtrl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value, 1, 2))
        );
      }
    });
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
              this.senderContactDto.contact = data.items[0];
            } else {
              this.senderContactDto.contact.id = 0;
            }
          } else if (senderReceiverPayer === 2) {
            // @ts-ignore
            if (data.items?.length === 1) {
              // @ts-ignore
              this.receiverContactDto.contact = data.items[0];
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
      ).subscribe(data => {
      if (senderReceiverPayer === 1) {
        this.searchedSenderContacts = data;
      } else if (senderReceiverPayer === 2) {
        this.searchedReceiverContacts = data;
      }
    });
  }

  // addressesOrPersons = 1  filter addresses / = 2  filter contact persons
  private _filter(value: string, senderReceiverPayer: number, addressesOrPersons: number): ContactAddress[] {
    if (addressesOrPersons === 1) {
      switch (senderReceiverPayer) {
        case 1:
          return this.senderAddresses.filter(option => option.street.includes(value));
        case 2:
          return this.receiverAddresses.filter(option => option.street.includes(value));
        default:
          return [];
      }
    } else {
      switch (senderReceiverPayer) {
        case 1:
          return this.senderContactPersons.filter(option => option.contactPerson.includes(value));
        case 2:
          return this.receiverContactPersons.filter(option => option.contactPerson.includes(value));
        default:
          return [];
      }
    }
  }

  getVolumeWeightIndex(): void {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.service.getVolumeWeightIndex();
        }),
        map(data => {
          // @ts-ignore
          return data;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => {
      // @ts-ignore
      this.slctedVolumeWeightIndex = data;
    });
  }

  getParcelPackages(id: number): void {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.service.getByPackageId(id);
        }),
        map(data => {
          // @ts-ignore
          return data;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => {
      let totalVolWeight = 0.0;
      const packs: Packages[] = data as Packages[];
      this.packagesCount = packs.length;
      packs.forEach(p => {
        this.dynamicArray.push(p);
        totalVolWeight += p.volumeWeight;
      });
      this.selectedObject.volumeWeight = totalVolWeight;
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params.id && params.id > 0) {
        this.service.getById(params.id).subscribe(existinParcel => {
          if (!existinParcel) {
            this.router.navigate(['parcels']);
          } else {

            this.getParcelPackages(existinParcel.id);

            this.selectedObject = existinParcel;
            this.senderContactDto.contact.name = this.selectedObject.senderName;
            this.senderContactDto.contact.identNumber = this.selectedObject.senderIdentNumber;
            this.senderAddressCtrl.setValue(this.selectedObject.senderAddress);
            this.senderContactPersonCtrl.setValue(this.selectedObject.senderContactPerson);
            this.senderContactDto.contactAddress.city = this.selectedObject.senderCity;
            // set senders data
            this.receiverContactDto.contact.name = this.selectedObject.receiverName;
            this.receiverContactDto.contact.identNumber = this.selectedObject.receiverIdentNumber;
            this.receiverAddressCtrl.setValue(this.selectedObject.receiverAddress);
            this.receiverContactPersonCtrl.setValue(this.selectedObject.receiverContactPerson);
            this.receiverContactDto.contactAddress.city = this.selectedObject.receiverCity;
            // set payer data
            this.payerContactDto.contact.name = this.selectedObject.payerName;
            this.payerContactDto.contact.identNumber = this.selectedObject.payerIdentNumber;
            this.payerContactDto.contactAddress.street = this.selectedObject.payerAddress;
            this.payerContactDto.contactAddress.contactPerson = this.selectedObject.payerContactPerson;
            this.payerContactDto.contactAddress.city = this.selectedObject.payerCity;
            // set common data
            this.packagesCount = this.selectedObject.count;
          }
        });
      }
    });

    this.getVolumeWeightIndex();

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
          return this.routeService.getList(1000, 0, '');
        }),
        map(data => {
          // @ts-ignore
          return data.items;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => this.routes = data);

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
