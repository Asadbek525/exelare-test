import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';

export const routes: Routes = [
  {
    path: 'candidates',
    component: MainLayout,
    loadChildren: () => import('./features/candidates/candidates.routes').then((m) => m.default),
  },
  {
    path: '**',
    redirectTo: 'candidates',
  },
];
