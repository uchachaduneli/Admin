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
import {AuthGuard} from './authentication/auth.guard';
import {ParcelStatusReasonsComponent} from './parcel-status-reasons/parcel-status-reasons.component';
import {ParcelStatusListComponent} from './parcel-status-list/parcel-status-list.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        component: CarListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard]
      },
      {
        path: 'cars',
        component: CarListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard]
      },
      {
        path: 'cities',
        component: CityListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard]
      },
      {
        path: 'contacts',
        component: ContactListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard]
      },
      {
        path: 'contact-address/:id',
        component: ContactAddressComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'parcelStatus',
        component: ParcelStatusListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard]
      },
      {
        path: 'parcelStatus-reasons/:id',
        component: ParcelStatusReasonsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'routes',
        component: RouteListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard]
      },
      {
        path: 'services',
        component: ServiceListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard]
      },
      {
        path: 'tranzits',
        component: TranzitListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard]
      },
      {
        path: 'warehouse',
        component: WarehouseListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard]
      },
      {
        path: 'zones',
        component: ZoneListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard]
      },
      {
        path: 'users',
        component: UserListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: '',
    component: AppBlankComponent,
    children: [
      {
        path: '',
        loadChildren:
          () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'authentication/404'
  }
];
