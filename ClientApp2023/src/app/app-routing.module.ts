import { Routes } from '@angular/router';
import { GlobalErrorComponent } from './global-error/global-error.component';
import { NotFoundComponentComponent } from './not-found-component/not-found-component.component';

export const AppRoutingModule: Routes = [
  { path: '', loadChildren: () => import('./modules/modules.module').then(m => m.ModulesModule)},
  // { path: 'error', component: GlobalErrorComponent},
  // { path: 'not-found', component: NotFoundComponentComponent },
  // { path: '**', redirectTo:'not-found', pathMatch:'full'},  
];