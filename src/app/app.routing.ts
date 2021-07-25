import {Routes} from '@angular/router';

import {FullComponent} from './layouts/full/full.component';
import {AppBlankComponent} from './layouts/blank/blank.component';
import {CarListComponent} from './car-list/car-list.component';
import {CityListComponent} from './city-list/city-list.component';
import {ContactListComponent} from './contact-list/contact-list.component';
import {TranzitListComponent} from './tranzit-list/tranzit-list.component';
import {ServiceListComponent} from './service-list/service-list.component';
import {RouteListComponent} from './route-list/route-list.component';
import {WarehouseListComponent} from './warehouse-list/warehouse-list.component';
import {ZoneListComponent} from './zone-list/zone-list.component';
import {UserListComponent} from './user-list/user-list.component';
import {ContactAddressComponent} from './contact-address/contact-address.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        component: CarListComponent,
        pathMatch: 'full'
      },
      {
        path: 'cars',
        component: CarListComponent,
        pathMatch: 'full'
      },
      {
        path: 'cities',
        component: CityListComponent,
        pathMatch: 'full'
      },
      {
        path: 'contacts',
        component: ContactListComponent,
        pathMatch: 'full'
      },
      {
        path: 'contact-address/:id',
        component: ContactAddressComponent,
        // pathMatch: 'full'
      },
      {
        path: 'routes',
        component: RouteListComponent,
        pathMatch: 'full'
      },
      {
        path: 'services',
        component: ServiceListComponent,
        pathMatch: 'full'
      },
      {
        path: 'tranzits',
        component: TranzitListComponent,
        pathMatch: 'full'
      },
      {
        path: 'warehouse',
        component: WarehouseListComponent,
        pathMatch: 'full'
      },
      {
        path: 'zones',
        component: ZoneListComponent,
        pathMatch: 'full'
      },
      {
        path: 'users',
        component: UserListComponent,
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'authentication/404'
  }
];
