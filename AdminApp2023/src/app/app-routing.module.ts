import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { GlobalErrorComponent } from './global-error/global-error.component';
import { NotFoundComponentComponent } from './not-found-component/not-found-component.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./main/main.module').then(m => m.MainModule), canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  // { path: 'error', component: GlobalErrorComponent},
  // { path: 'not-found', component: NotFoundComponentComponent },
  // { path: '**', redirectTo:'not-found', pathMatch:'full'},  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
