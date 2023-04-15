import { MainComponent } from './main.component';
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoleGuard } from '../core/guards/role.guard';
import { Role } from '../entities/role';

export const MainRoutes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      { path: '', component: DashboardComponent },   
      {
        path: 'auth',
        loadChildren: () =>
          import('./auth/auth.module').then((m) => m.AuthModule),
        canActivate: [RoleGuard],
        data: { roles: [Role.Admin] },
      },       
    ]
  }
];
