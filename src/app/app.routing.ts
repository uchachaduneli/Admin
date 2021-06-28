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
      // ,
      // {
      //   path: 'dashboard',
      //   redirectTo: '/dashboards/dashboard1',
      //   pathMatch: 'full'
      // },
      // {
      //   path: 'dashboards',
      //   loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule)
      // },
      // {
      //   path: 'material',
      //   loadChildren: () => import('./material-component/material.module').then(m => m.MaterialComponentsModule)
      // },
      // {
      //   path: 'apps',
      //   loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule)
      // }
      // {
      //   path: 'forms',
      //   loadChildren: () => import('./forms/forms.module').then(m => m.FormModule)
      // },
      // {
      //   path: 'tables',
      //   loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule)
      // },
      // {
      //   path: 'tree',
      //   loadChildren: () => import('./tree/tree.module').then(m => m.TreeModule)
      // },
      // {
      //   path: 'datatables',
      //   loadChildren: () => import('./datatables/datatables.module').then(m => m.DataTablesModule)
      // },
      // {
      //   path: 'pages',
      //   loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
      // },
      // {
      //   path: 'widgets',
      //   loadChildren: () => import('./widgets/widgets.module').then(m => m.WidgetsModule)
      // },
      // {
      //   path: 'charts',
      //   loadChildren: () => import('./charts/chartslib.module').then(m => m.ChartslibModule)
      // },
      // {
      //   path: 'multi',
      //   loadChildren: () => import('./multi-dropdown/multi-dd.module').then(m => m.MultiModule)
      // }
    ]
  },
  // {
  //   path: '',
  //   component: AppBlankComponent,
  //   children: [
  //     {
  //       path: 'authentication',
  //       loadChildren:
  //         () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
  //     }
  //   ]
  // },
  {
    path: '**',
    redirectTo: 'authentication/404'
  }
];
