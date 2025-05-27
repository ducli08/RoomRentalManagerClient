import { Routes } from '@angular/router';
import { AuthGuard } from './shared/auth-guard.services';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES), canActivate:[AuthGuard] },
  { path: 'users', loadChildren: () => import('./pages/users/users.routes').then(m => m.USERS_ROUTES), canActivate:[AuthGuard] },
  { path: 'login', loadChildren: () => import('./pages/login/login.routes').then(m => m.LOGIN_ROUTES) },
];
