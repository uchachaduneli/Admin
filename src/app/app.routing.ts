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
import {TariffListComponent} from './tariff-list/tariff-list.component';
import {TariffDetailsComponent} from './tariff-details/tariff-details.component';
import {ParcelListComponent} from './parcel-list/parcel-list.component';
import {ParcelFormComponent} from './parcel-form/parcel-form.component';
import {DoctypesComponent} from './doctypes/doctypes.component';
import {ParcelDetailsComponent} from './parcel-details/parcel-details.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        component: ParcelListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard]
      },
      {
        path: 'parcels',
        component: ParcelListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard]
      },
      {
        path: 'parcel-form/:id',
        component: ParcelFormComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'parcel-details/:id',
        component: ParcelDetailsComponent,
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
        path: 'doctypes',
        component: DoctypesComponent,
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
        path: 'tariff',
        component: TariffListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard]
      },
      {
        path: 'tariff-details/:id',
        component: TariffDetailsComponent,
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
