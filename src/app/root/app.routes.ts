import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../routes/list').then((x) => x.ListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('../routes/new').then((x) => x.NewComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
