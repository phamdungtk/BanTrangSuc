import { Routes } from '@angular/router';
import { IndexComponent } from './main/index/index.component';
import { ModulesComponent } from './modules.component';
export const ModulesRoutingModule: Routes = [
  {
    path: '', component: ModulesComponent,
    children: [
      { path: '', component: IndexComponent },
      //{ path: 'chitietsp', component: DateilComponent },
      { path: '', loadChildren: () => import('./main/main.module').then(m => m.MainModule)},
      { path: 'customers', loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)},
    ]
  }
];
