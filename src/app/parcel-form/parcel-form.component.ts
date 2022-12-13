import {AfterViewInit, Component, ElementRef, Inject, Optional, ViewChild} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
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
import {TariffService} from '../services/tariff.service';
import {User} from '../models/user';
import {TokenStorageService} from '../services/token-storage.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ExcelTmpParcel} from '../models/ExcelTmpParcel';

@Component({
  selector: 'app-parcel-form',
  templateUrl: './parcel-form.component.html',
  styleUrls: ['./parcel-form.component.scss']
})
export class ParcelFormComponent implements AfterViewInit {
  cities: City[] = [];
  public filteredSenderCitiesList: City[] = [];
  public filteredReceiverCitiesList: City[] = [];
  public filteredPayerCitiesList: City[] = [];
  services!: Service[];
  routes!: Route[];
  docTypes!: DocType[];
  selectedObject: Parcel = new Parcel();
  senderContactDto: ContactDTO = new ContactDTO();
  payerContactDto: ContactDTO = new ContactDTO();
  receiverContactDto: ContactDTO = new ContactDTO();
  foundedSenderContactAddress!: ContactAddress;
  isLoadingResults = false;
  // @ts-ignore
  @ViewChild('searchedSenderContactsSelect') searchedSenderContactsSelect: any;
  // @ts-ignore
  @ViewChild('searchedReceiverContactsSelect') searchedReceiverContactsSelect: any;
  searchedSenderContacts!: Contact[];
  searchedReceiverContacts!: Contact[];
  searchedPayerContacts!: Contact[];
  senderAddresses: ContactAddress[] = [];
  receiverAddresses: ContactAddress[] = [];
  senderContactPersons: ContactAddress[] = [];
  receiverContactPersons: ContactAddress[] = [];
  filteredSenderAddresses!: Observable<ContactAddress[]>;
  filteredSenderContactPersons!: Observable<ContactAddress[]>;
  filteredSenderContacts!: Observable<ContactAddress[]>;
  filteredReceiverAddresses!: Observable<ContactAddress[]>;
  filteredReceiverContactPersons!: Observable<ContactAddress[]>;
  senderAddressCtrl: FormControl = new FormControl();
  senderContactPersonCtrl: FormControl = new FormControl();
  receiverContactPersonCtrl: FormControl = new FormControl();
  receiverAddressCtrl: FormControl = new FormControl();
  dynamicArray: Array<Packages> = [];
  slctedVolumeWeightIndex: VolumeWeightIndex = new VolumeWeightIndex();
  packagesCount = 1;
  preGenerationCount!: number;
  currentUser!: User;

  constructor(private formBuilder: FormBuilder, private cityService: CityService, private utilService: UtilService,
              public dialog: MatDialog,
              private contactService: ContactService, private companyServices: CompanyServicesService,
              private routeService: RouteService,
              private contactAddressService: ContactAddressService, private service: ParcelService,
              private tarrifService: TariffService,
              private notifyService: NotificationService, private route: ActivatedRoute, private router: Router,
              private tokenStorageService: TokenStorageService,
              private docTypeService: DoctypesService) {
  }

  showPrintDlg(): void {
    this.openDialog('Print', this.selectedObject);
  }

  validateNextStep(i: number, stepper: MatStepper): void {
    if (i === 1) {
      // if (!this.senderContactDto.contact.id) {
      //   this.notifyService.showError('გთხოვთ მიუთითეთ გამგზავნის შესახებ ინფორმაცია', '');
      // } else
      if (!this.senderContactDto.contactAddress.city.id) {
        this.notifyService.showError('გთხოვთ მიუთითეთ ქალაქი გამგზავნის ბლოკში', '');
      } else if (this.senderAddressCtrl.value === null || this.senderAddressCtrl.value.length < 1) {
        this.notifyService.showError('გთხოვთ მიუთითეთ მისამართი გამგზავნის ბლოკში', '');
      } else if (this.senderContactPersonCtrl.value === null || this.senderContactPersonCtrl.value.length < 1) {
        this.notifyService.showError('გთხოვთ მიუთითეთ საკონტაქტო პირი გამგზავნის ბლოკში', '');
      } else {
        stepper.next();
      }
    } else if (i === 2) {
      // if (!this.receiverContactDto.contact.id && !this.receiverContactDto.contact.identNumber) {
      //   this.notifyService.showError('გთხოვთ მიუთითეთ მიმღების შესახებ ინფორმაცია', '');
      // } else
      if (!this.receiverContactDto.contactAddress.city.id) {
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
        } else if (!this.payerContactDto.contactAddress.contactPerson ||
          this.payerContactDto.contactAddress.contactPerson.length < 1) {
          this.notifyService.showError('გთხოვთ მიუთითეთ საკონტაქტო პირი გადამხდელის ბლოკში', '');
        } else {
          stepper.next();
        }
      } else {
        stepper.next();
      }
    }
  }

  prePrintParcelBarCode(): void {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.service.preGeneration(this.preGenerationCount);
        }),
        map(data => {
          // @ts-ignore
          return data;
        }),
        catchError(error => {
          this.notifyService.showError('ბარკოდების გენერაცია ვერ მოხერხდა', '');
          console.log(error);
          return observableOf([]);
        })
      ).subscribe(data => {
      this.notifyService.showInfo(this.preGenerationCount + ' ბარკოდის გენერაცია დასრულდა წარმატებით', '');
      this.preGenerationCount = 0;
    });
  }

  validateBeforeSave(): boolean {
    // sender
    // if (!this.senderContactDto.contact.id && !this.senderContactDto.contact.identNumber) {
    //   this.notifyService.showError('გთხოვთ მიუთითეთ გამგზავნის შესახებ ინფორმაცია', '');
    //   return false;
    // } else
    if (!this.senderContactDto.contactAddress.city.id) {
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
    // if (!this.receiverContactDto.contact.id && !this.receiverContactDto.contact.identNumber) {
    //   this.notifyService.showError('გთხოვთ მიუთითეთ მიმღების შესახებ ინფორმაცია', '');
    //   return false;
    // } else
    if (!this.receiverContactDto.contactAddress.city.id) {
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
      // } else if (!this.selectedObject.gadafutvisPrice) {
      //   this.notifyService.showError('გთხოვთ მიუთითეთ გადაფუთვის ფასი', '');
      //   return false;
    } else if (!this.selectedObject.deliveryType) {
      this.notifyService.showError('გთხოვთ მიუთითეთ ჩაბარების ტიპი', '');
      return false;
    } else if (!this.selectedObject.paymentType) {
      this.notifyService.showError('გთხოვთ მიუთითეთ გადახდის ტიპი', '');
      return false;
    } else if (!this.selectedObject.packageType) {
      this.notifyService.showError('გთხოვთ მიუთითეთ პაკეტის ტიპი', '');
      return false;
    } else if (!this.selectedObject.service.id) {
      this.notifyService.showError('გთხოვთ მიუთითეთ გზავნილის ტიპი', '');
      return false;
    } else if (!this.selectedObject.route.id) {
      this.notifyService.showError('გთხოვთ მიუთითეთ მარშრუტი', '');
      return false;
    }
    return true;
  }

  save(moveAndPrint: boolean, moveAndNotifyCouriers: boolean): void {

    if (this.validateBeforeSave()) {
      // set senders data
      this.selectedObject.senderName = this.senderContactDto.contact.name;
      this.selectedObject.senderIdentNumber = this.senderContactDto.contact.identNumber;
      this.selectedObject.senderAddress = this.senderAddressCtrl.value;
      this.selectedObject.senderContactPerson = this.senderContactPersonCtrl.value;
      // @ts-ignore
      this.selectedObject.senderCity = {id: this.senderContactDto.contactAddress.city.id};
      this.selectedObject.sendSmsToSender = this.senderContactDto.sendSms ? 1 : 2;
      this.selectedObject.senderPhone = this.senderContactDto.contactAddress.contactPersonPhone;
      // set senders data
      this.selectedObject.receiverName = this.receiverContactDto.contact.name;
      this.selectedObject.receiverIdentNumber = this.receiverContactDto.contact.identNumber;
      this.selectedObject.receiverAddress = this.receiverAddressCtrl.value;
      this.selectedObject.receiverContactPerson = this.receiverContactPersonCtrl.value;
      this.selectedObject.sendSmsToReceiver = this.receiverContactDto.sendSms ? 1 : 2;
      this.selectedObject.receiverPhone = this.receiverContactDto.contactAddress.contactPersonPhone;
      // @ts-ignore
      this.selectedObject.receiverCity = {id: this.receiverContactDto.contactAddress.city.id};

      // set payers data
      if (this.selectedObject.payerSide === 1) { // when sender pays
        this.selectedObject.senderId = this.senderContactDto.contact.id;
        this.selectedObject.payerName = this.senderContactDto.contact.name;
        this.selectedObject.payerIdentNumber = this.senderContactDto.contact.identNumber;
        this.selectedObject.payerAddress = this.senderAddressCtrl.value;
        this.selectedObject.payerContactPerson = this.senderContactPersonCtrl.value;
        // @ts-ignore
        this.selectedObject.payerCity = {id: this.senderContactDto.contactAddress.city.id};
      } else if (this.selectedObject.payerSide === 2) {// when receiver pays
        this.selectedObject.receiverId = this.receiverContactDto.contact.id;
        this.selectedObject.payerName = this.receiverContactDto.contact.name;
        this.selectedObject.payerIdentNumber = this.receiverContactDto.contact.identNumber;
        this.selectedObject.payerAddress = this.receiverAddressCtrl.value;
        this.selectedObject.payerContactPerson = this.receiverContactPersonCtrl.value;
        // @ts-ignore
        this.selectedObject.payerCity = {id: this.receiverContactDto.contactAddress.city.id};
      } else if (this.selectedObject.payerSide === 3) { // when third person pays
        this.selectedObject.payerId = this.payerContactDto.contact.id;
        this.selectedObject.payerName = this.payerContactDto.contact.name;
        this.selectedObject.payerIdentNumber = this.payerContactDto.contact.identNumber;
        this.selectedObject.payerAddress = this.payerContactDto.contactAddress.street;
        this.selectedObject.payerContactPerson = this.payerContactDto.contactAddress.contactPerson;
        // @ts-ignore
        this.selectedObject.payerCity = {id: this.payerContactDto.contactAddress.city.id};
      }

      // set parcel data
      this.selectedObject.count = this.packagesCount;
      // @ts-ignore
      this.selectedObject.author = {id: this.currentUser.id};

      // console.log('senderDto ', this.senderContactDto);
      // console.log('send to api ', this.selectedObject);

      merge()
        .pipe(
          startWith({}),
          switchMap(() => {
            if (this.selectedObject.id > 0) {
              return this.service.update(this.selectedObject);
            } else {
              return this.service.create(this.selectedObject);
            }
          }),
          map(data => {
            this.notifyService.showSuccess('ამანათის ინფორმაცია შენახულია', '');
            // @ts-ignore
            this.saveParcelPackages(data.id);
            this.router.navigate(['parcels']);
            // @ts-ignore
            return data;
          }),
          catchError(error => {
            this.notifyService.showError('მონაცემების შენახვა ვერ მოხერხდა', '');
            console.log(error);
            return observableOf([]);
          })
        ).subscribe(data => {
        if (moveAndPrint) {
          this.openDialog('Print', data);
        }
      });
    } else {
      console.log('fields validation failed During Saving Parcel');
    }
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(ParcelFormPrintDialogContent, {
      data: obj
    });
  }

  saveParcelPackages(id: number): void {
    this.dynamicArray.forEach(e => {
      // @ts-ignore
      e.parcel = {id};
    });
    this.service.createPackages(this.dynamicArray).subscribe(res => {
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
    // if(senderReceiverPayer == 1){
    //   this.senderContactDto
    // }
  }

  calculateTotalPrice(): void {
    if (!this.selectedObject.gadafutvisPrice) {
      this.selectedObject.gadafutvisPrice = 0;
    }
    let calculatedWeight = 0;
    // ამ if -ში წონის არჩევა ხდება. თუ წონა ან მოცულობითი ნალია და მეორე არაა იმის მიხედვით დათვლის ფასს
    if ((!this.selectedObject.weight || this.selectedObject.weight === 0)
      && (this.selectedObject.volumeWeight && this.selectedObject.volumeWeight > 0)) {
      calculatedWeight = this.selectedObject.volumeWeight;
    } else if ((!this.selectedObject.volumeWeight || this.selectedObject.volumeWeight === 0)
      && (this.selectedObject.weight && this.selectedObject.weight > 0)) {
      calculatedWeight = this.selectedObject.weight;
      // თუ ორივე მოცემულია მაქსიმუმის მიხედვით
    } else if ((this.selectedObject.weight && this.selectedObject.weight > 0)
      && (this.selectedObject.volumeWeight && this.selectedObject.volumeWeight > 0)) {
      // თუ ორივე მოცემულია და ერთმანეთის ტოლია რომელიმეს აიღებს
      if (this.selectedObject.weight === this.selectedObject.volumeWeight) {
        calculatedWeight = this.selectedObject.weight;
      } else {
        calculatedWeight = this.selectedObject.weight > this.selectedObject.volumeWeight ?
          this.selectedObject.weight : this.selectedObject.volumeWeight;
      }
    } else {
      console.log('Can not determine weight for calculating weight');
    }
    this.notifyService.showInfo('კალკულაცია ხდება ' + calculatedWeight + 'კგ -ზე', '');
    // თუ დასეივებული კონტაქტია ბაზიდან წამოიღოს მიბმული ტარიფის აიდი
    let payerContactId = 0;
    switch (this.selectedObject.payerSide) {
      case 1:
        payerContactId = this.senderContactDto.contact.id;
        break;
      case 2:
        payerContactId = this.receiverContactDto.contact.id;
        break;
      case 3:
        payerContactId = this.payerContactDto.contact.id;
        break;
      default:
        console.log('payer side switch default block :(');
        this.notifyService.showError('გთხოვთ მიუთითოთ გადამხდელი მხარე', '');
        break;
    }

    if (payerContactId > 0) {
      // გადამხდელი კონტაქტი ბაზაში არსებობს და იმის ტარიფი, და ქალაქი ავიღოთ კალკულაციისთვის
      console.log('კალკულაცია გადამხდელი კონტაქტის ტარიფით - გადამხდელი კონტაქტი ბაზაში არსებობს');
      merge().pipe(
        startWith({}),
        switchMap(() => {
          return this.contactService.getById(payerContactId);
        }),
        map(data => {
          // @ts-ignore
          return data;
        }), catchError(contNotFoudErr => {
          // კონტაქტის წამოღება ვერ მოხერხდა რო ამის ტარიფი და ზონა გამოგვეყენებინა კალკულაციაში
          console.log(contNotFoudErr, ' ტარიფის ასაღებად გადამხდელი კონტაქტი ვერ მოიძებნა payerContactId=' + payerContactId + '');
          this.notifyService.showError('ფასის კალკულაციისთვის გადამხდელი კონტაქტის მონაცემების წამოღება ვერ მოხერხდა ', '');
          return observableOf([]);
        })
      ).subscribe(c => {
        c = c as Contact;
        if (c) {
          // მოიძებნა ბაზაში და ტარიფსაც მოძებნილისას გამოიყენებს
          console.log('მოიძებნა ბაზაში და ტარიფსაც მოძებნილისას გამოიყენებს ', c);
          if (!c.tariff) {
            this.notifyService.showError('კალკულაცია ვერ ხერხდება!!! გთხოვთ გამგზავნ კონტაქტს ' +
              'მიაბათ ტარიფი კონტაქტების გვერდზე', '');
            return;
          } else {
            console.log('მიმდინარეობს ნაპოვნი კონტაქტის ტარიფის აიდით, ზონით და წონით ფასის წამოღება');
            // getting city with max zone name(longest distance) by id to read city.zone.id
            merge()
              .pipe(
                startWith({}),
                switchMap(() => {
                  return this.cityService.getHavingMaxZoneIndex(this.senderContactDto.contactAddress.city.id,
                    this.receiverContactDto.contactAddress.city.id);
                }),
                map(data => {
                  // @ts-ignore
                  return data;
                }),
                catchError(err => {
                  console.log('ქალაქის მიხედვით, ზონის წამოღება ვერ მოხერხდა ', err);
                  this.notifyService.showError('ტარიფის მისაღებად, ზონის წამოღება ვერ მოხერხდა', '');
                  return observableOf([]);
                })
              ).subscribe(city => {
              // @ts-ignore
              console.log('city with zone having max name ', city.zone);
              merge()
                .pipe(
                  startWith({}),
                  switchMap(() => {
                    // @ts-ignore
                    return this.tarrifService.getPriceFor(this.selectedObject.service.id, c.tariff.id, city.zone.id,
                      calculatedWeight);
                  }),
                  map(data => {
                    // @ts-ignore
                    return data;
                  }),
                  catchError(err => {
                    console.log('კონტაქტზე ტარიფის წამოღება ვერ მოხერხდა ', err);
                    this.notifyService.showError('ფასის დათვლა ვერ მოხერხდა! გადაამოწმეთ ტარიფებში წონის არსებობა', '');
                    return observableOf([]);
                  })
                ).subscribe(r => {
                console.log('ნაპოვნი კონტაქტის ტარიფის წამოღება დასრულდა წარმატებით, ტარიფ: ' + r);
                r = r as number;
                this.notifyService.showSuccess('ტარიფი ' + r + ' + გადაფუთვა: ' + this.selectedObject.gadafutvisPrice, '');
                this.selectedObject.totalPrice = r + this.selectedObject.gadafutvisPrice;
              });
            });
          }
        }
      });
    } else {
      console.log('კალკულაცია სტანდარტული ტარიფით - გადამხდელი კონტაქტი ბაზაში დასეივებული არაა');
      // გადამხდელი კონტაქტი ბაზაში ვერ მოიძებნა - (ერთჯერადი გაგზავნაა და კონტაქტების სიაში არაა ან ტექნიკური პრობლემაა ძებნისას )
      // შესაბამისად ტარიფიც არ გვაქვს და ვცდილობთ სტანდარტული ტარიფით კალკულაციას
      merge()
        .pipe(
          startWith({}),
          switchMap(() => {
            return this.cityService.getHavingMaxZoneIndex(this.senderContactDto.contactAddress.city.id,
              this.receiverContactDto.contactAddress.city.id);
          }),
          map(data => {
            // @ts-ignore
            return data;
          }),
          catchError(err => {
            console.log('გადამხდელის ზონის წამოღება ვერ მოხერხდა ', err);
            this.notifyService.showError('კალკულაციისთვის მითითებული ქალაქით ზონის წამოღება ვერ მოხერხდა', '');
            return observableOf([]);
          })
        ).subscribe(city => {
        merge()
          .pipe(
            startWith({}),
            switchMap(() => {
              // @ts-ignore
              return this.tarrifService.getPriceFor(this.selectedObject.service.id, 1, city.zone.id, calculatedWeight);
            }),
            map(data => {
              // @ts-ignore
              return data;
            }),
            catchError(err => {
              console.log('სტანდარტული ტარიფის დეტალების წამოღება ვერ მოხერხდა ', err);
              this.notifyService.showError('მთლიანი ფასის დათვლა ვერ მოხერხდა! (ტარიფის დეტალები ვერ მოიძებნა)', '');
              return observableOf([]);
            })
          ).subscribe(r => {
          console.log('სტანდარტული ტარიფის წამოღება დასრულდა ტარიფი: ' + r);
          r = r as number;
          this.notifyService.showSuccess('ტარიფი ' + r + ' + გადაფუთვა: ' + this.selectedObject.gadafutvisPrice, '');
          this.selectedObject.totalPrice = r + this.selectedObject.gadafutvisPrice;
          return;
        });
      });
    }
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
    this.isLoadingResults = true;
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
    } else if (senderReceiverPayer === 3) {
      tmp = {
        name: this.payerContactDto.contact.name,
        identNumber: this.payerContactDto.contact.identNumber
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
              // @ts-ignore
              this.searchedSenderContacts = data.items;
            }
          } else if (senderReceiverPayer === 2) {
            // @ts-ignore
            if (data.items?.length === 1) {
              // @ts-ignore
              this.receiverContactDto.contact = data.items[0];
            } else {
              this.receiverContactDto.contact.id = 0;
              // @ts-ignore
              this.searchedReceiverContacts = data.items;
            }
          } else if (senderReceiverPayer === 3) {
            // @ts-ignore
            if (data.items?.length === 1) {
              // @ts-ignore
              this.payerContactDto.contact = data.items[0];
            } else {
              this.payerContactDto.contact.id = 0;
            }
          }
          // @ts-ignore
          return data.items;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => {
      if (senderReceiverPayer === 1) {
        // this.searchedSenderContacts = data;
        setTimeout(() => {
          this.searchedSenderContactsSelect.open();
        }, 1000);
      } else if (senderReceiverPayer === 2) {
        // this.searchedReceiverContacts = data;
        setTimeout(() => {
          this.searchedReceiverContactsSelect.open();
        }, 1000);
      }
      this.isLoadingResults = false;
    });
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
      console.log(this.dynamicArray);
    });
  }

  idToBarcode(): string[] {
    // return this.selectedObject.id ? this.selectedObject.id.toString().split('\n') : [];
    return this.selectedObject.barCode ? [this.selectedObject.barCode] : [];
  }

  ngAfterViewInit(): void {
    this.currentUser = this.tokenStorageService.getUser();
    this.route.params.subscribe(params => {
      if (params.id && params.id > 0) {
        this.service.getById(params.id).subscribe(existinParcel => {
          if (!existinParcel) {
            this.router.navigate(['parcels']);
          } else {

            this.getParcelPackages(existinParcel.id);
            // console.log(existinParcel);
            this.selectedObject = existinParcel;
            if (!this.selectedObject.route) {
              // @ts-ignore
              this.selectedObject.route = {id: 0};
            }
            // set senders data
            this.senderContactDto.contact.id = this.selectedObject.senderId;
            this.senderContactDto.contact.name = this.selectedObject.senderName;
            this.senderContactDto.contact.identNumber = this.selectedObject.senderIdentNumber;
            this.senderAddressCtrl.setValue(this.selectedObject.senderAddress);
            this.senderContactPersonCtrl.setValue(this.selectedObject.senderContactPerson);
            this.senderContactDto.contactAddress.city = this.selectedObject.senderCity;
            this.senderContactDto.sendSms = this.selectedObject.sendSmsToSender === 1 ? true : false;
            this.senderContactDto.contactAddress.contactPersonPhone = this.selectedObject.senderPhone;
            // set receiver data
            this.receiverContactDto.contact.id = this.selectedObject.receiverId;
            this.receiverContactDto.contact.name = this.selectedObject.receiverName;
            this.receiverContactDto.contact.identNumber = this.selectedObject.receiverIdentNumber;
            this.receiverAddressCtrl.setValue(this.selectedObject.receiverAddress);
            this.receiverContactPersonCtrl.setValue(this.selectedObject.receiverContactPerson);
            this.receiverContactDto.contactAddress.city = this.selectedObject.receiverCity;
            this.receiverContactDto.sendSms = this.selectedObject.sendSmsToReceiver === 1 ? true : false;
            this.receiverContactDto.contactAddress.contactPersonPhone = this.selectedObject.receiverPhone;
            // set payer data
            this.payerContactDto.contact.id = this.selectedObject.payerId;
            this.payerContactDto.contact.name = this.selectedObject.payerName;
            this.payerContactDto.contact.identNumber = this.selectedObject.payerIdentNumber;
            this.payerContactDto.contactAddress.street = this.selectedObject.payerAddress;
            this.payerContactDto.contactAddress.contactPerson = this.selectedObject.payerContactPerson;
            this.payerContactDto.contactAddress.city = this.selectedObject.payerCity;
            // set common data
            this.packagesCount = this.selectedObject.count;
            // console.log('Set data from db to senderDto ', this.senderContactDto);
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
      this.filteredSenderCitiesList = this.cities.slice();
      this.filteredReceiverCitiesList = this.cities.slice();
      this.filteredPayerCitiesList = this.cities.slice();
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
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dialog-content',
  templateUrl: 'dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class ParcelFormPrintDialogContent {
  action: string;
  selectedObject: any;

  constructor(public dialogRef: MatDialogRef<ParcelFormPrintDialogContent>,
              // @Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data: ExcelTmpParcel) {
    this.selectedObject = {...data};
    this.action = this.selectedObject.action;
  }

  doAction(): void {
    this.dialogRef.close({event: this.action, data: this.selectedObject});
  }

  closeDialog(): void {
    this.dialogRef.close({event: 'Cancel'});
  }
}
