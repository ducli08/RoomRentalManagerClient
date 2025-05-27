import { Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
import { AuthGuard } from '../../shared/auth-guard.services';

export const MAIN_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/welcome' },
        { path: 'welcome', loadChildren: () => import('../../pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES), canActivate:[AuthGuard] },
        { path: 'users', loadChildren: () => import('../../pages/users/users.routes').then(m => m.USERS_ROUTES), canActivate:[AuthGuard] },
    ]
  }
];