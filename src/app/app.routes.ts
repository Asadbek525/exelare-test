import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { authGuard, guestGuard } from './core/guards';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'Consultants',
    component: MainLayout,
    canActivate: [authGuard],
    loadChildren: () => import('./features/candidates/candidates.routes').then((m) => m.default),
  },
  {
    path: '**',
    redirectTo: 'Consultants',
  },
];
