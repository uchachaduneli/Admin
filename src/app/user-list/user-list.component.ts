import {AfterViewInit, Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NotificationService} from '../services/notification.service';
import {UtilService} from '../services/util.service';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {Role} from '../models/role';
import {RoleService} from '../services/role.service';
import {User} from '../models/user';
import {UserBackendApi, UserService} from '../services/user.service';
import {City} from '../models/city';
import {CityService} from '../services/city.service';
import {RouteService} from '../services/route.service';
import {Route} from '../models/route';
import {WarehouseService} from '../services/warehouse.service';
import {Warehouse} from '../models/warehouse';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements AfterViewInit {
  // @ts-ignore
  srchObj: User = {city: {}, warehouse: {}, route: {}, srchRoleName: []};
  cities: City [] = [];
  routes: Route [] = [];
  roles: Role [] = [];
  warehouseList: Warehouse [] = [];
  public filteredSenderCitiesList: City[] = [];
  data = new MatTableDataSource<UserBackendApi>();
  displayedColumns: string[] = ['id', 'userName', 'name', 'lastName', 'personalNumber', 'phone', 'city', 'route', 'action'];

  resultsLength = 0;
  isLoadingResults = true;
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);

  constructor(public dialog: MatDialog, private service: UserService,
              private roleSrvice: RoleService,
              private warehouseService: WarehouseService,
              private cityService: CityService,
              private routeService: RouteService,
              private notifyService: NotificationService, private utilService: UtilService) {
  }

  ngAfterViewInit(): void {
    this.getMainData();
  }

  onCitySelect(selectedCityId: number): void {
    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.routeService.getByCityId(selectedCityId);
      }),
      map(data => {
        // @ts-ignore
        return data;
      }),
      catchError(() => {
        return observableOf([]);
      })
    ).subscribe(data => {
      this.routes = data;
    });

    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.warehouseService.getByCityId(selectedCityId);
      }),
      map(data => {
        // @ts-ignore
        return data;
      }),
      catchError(() => {
        return observableOf([]);
      })
    ).subscribe(data => {
      this.warehouseList = data;
    });
  }

  clearFilters(): void {
    // @ts-ignore
    this.srchObj = {city: {}, warehouse: {}, route: {}, srchRoleName: []};
    this.getMainData();
  }

  getMainData(): void {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          // @ts-ignore
          return this.service.getList(this.paginator.pageSize, this.paginator.pageIndex, this.utilService.encode(this.srchObj));
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          // @ts-ignore
          this.resultsLength = data.total_count;
          // @ts-ignore
          return data.items;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => this.data = data);

    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.roleSrvice.getList();
      }),
      map(data => {
        // @ts-ignore
        this.roles = data;
        // @ts-ignore
        return data;
      }),
      catchError(() => {
        return observableOf([]);
      })
    ).subscribe(data => {
      this.roles = data;
    });
    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.cityService.getList(1000, 0, '');
      }),
      map(data => {
        // @ts-ignore
        this.cities = data.items;
        // @ts-ignore
        return data.items;
      }),
      catchError(() => {
        return observableOf([]);
      })
    ).subscribe(data => {
      this.cities = data;
      this.filteredSenderCitiesList = this.cities.slice();
    });
  }

  save(obj: User): void {
    this.service.create(obj).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', 'ჩანაწერის დამატება');
      this.getMainData();
    }, error => {
      this.notifyService.showError(!!error.error && error.error.includes('მითითებული') ? error.error : 'ოპერაცია არ სრულდება', 'ჩანაწერის დამატება');
      console.log(error);
    });
  }

  update(obj: User): void {
    this.service.update(obj).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', 'ჩანაწერის განახლება');
      this.getMainData();
    }, error => {
      this.notifyService.showError(!!error.error && error.error.includes('მითითებული') ? error.error : 'ოპერაცია არ სრულდება', 'ჩანაწერის განახლება');
      console.log(error);
    });
  }

  delete(obj: User): void {
    this.service.delete(obj.id).subscribe(() => {
      this.notifyService.showSuccess('ოპერაცია დასრულდა წარმატებით', 'ჩანაწერის წაშლა');
      this.getMainData();
    }, error => {
      this.notifyService.showError('ოპერაცია არ სრულდება', 'ჩანაწერის წაშლა');
      console.log(error);
    });
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(UserDialogContent, {data: obj, maxWidth: '50%'});
    // @ts-ignore
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        if (result.event === 'Add') {
          console.log(result);
          this.save(result.data);
        } else if (result.event === 'Update') {
          this.update(result.data);
        } else if (result.event === 'Delete') {
          this.delete(result.data);
        }
      }
    });
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dialog-content',
  templateUrl: 'dialog-content.html',
})
// tslint:disable-next-line:component-class-suffix
export class UserDialogContent implements OnInit {
  action: string;
  selectedObject: any;
  roles: Role [] = [];
  cities: City [] = [];
  routes: Route [] = [];
  selectedRoles: string [] = [];
  warehouseList: Warehouse [] = [];

  constructor(public dialogRef: MatDialogRef<UserDialogContent>,
              private roleSrvice: RoleService,
              private warehouseService: WarehouseService,
              private cityService: CityService,
              private routeService: RouteService,
              // @Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data: User) {
    this.selectedObject = {...data};
    this.action = this.selectedObject.action;
    this.selectedObject.changePass = false;
    if (!this.selectedObject.status) {
      this.selectedObject.status = {id: 1};
    }
    if (!this.selectedObject.role) {
      this.selectedObject.role = [];
    } else {
      // @ts-ignore
      this.selectedObject.role.forEach((r) => {
        this.selectedRoles.push(r.name);
      });
    }
    if (!this.selectedObject.city) {
      this.selectedObject.city = {};
    } else {
      this.onCitySelect(this.selectedObject.city.id);
    }
    if (!this.selectedObject.route) {
      this.selectedObject.route = {};
    }
    if (!this.selectedObject.warehouse) {
      this.selectedObject.warehouse = {};
    }
  }

  passChangeEnableDisable(event: any): void {
    this.selectedObject.changePass = event.checked;
  }

  doAction(): void {
    let isCustomerAddition = false;
    // @ts-ignore
    this.selectedRoles.forEach((r) => {
      if (r === 'CUSTOMER') {
        isCustomerAddition = true;
      }
      this.selectedObject.role.push({name: r});
    });
    if (isCustomerAddition) {
      this.selectedObject.route = null;
      this.selectedObject.warehouse = null;
    }
    this.dialogRef.close({event: this.action, data: this.selectedObject});
  }

  closeDialog(): void {
    this.dialogRef.close({event: 'Cancel'});
  }

  onCitySelect(selectedCityId: number): void {
    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.routeService.getByCityId(selectedCityId);
      }),
      map(data => {
        // @ts-ignore
        return data;
      }),
      catchError(() => {
        return observableOf([]);
      })
    ).subscribe(data => {
      this.routes = data;
    });

    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.warehouseService.getByCityId(selectedCityId);
      }),
      map(data => {
        // @ts-ignore
        return data;
      }),
      catchError(() => {
        return observableOf([]);
      })
    ).subscribe(data => {
      this.warehouseList = data;
    });
  }

  ngOnInit(): void {
    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.roleSrvice.getList();
      }),
      map(data => {
        // @ts-ignore
        this.roles = data;
        // @ts-ignore
        return data;
      }),
      catchError(() => {
        return observableOf([]);
      })
    ).subscribe(data => {
      this.roles = data;
    });
    merge().pipe(
      startWith({}),
      switchMap(() => {
        return this.cityService.getList(1000, 0, '');
      }),
      map(data => {
        // @ts-ignore
        this.cities = data.items;
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
