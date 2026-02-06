import { Routes } from '@angular/router';
import { AuthComponent } from './auth.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: 'login', component: AuthComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];
