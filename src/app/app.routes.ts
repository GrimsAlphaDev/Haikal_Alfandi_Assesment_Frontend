import { Routes } from '@angular/router';
import { BannerComponent } from './features/banner/banner.component';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: BannerComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
