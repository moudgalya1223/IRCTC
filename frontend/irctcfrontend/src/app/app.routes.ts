import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home').then((component) => component.Home),
    title: 'IRCTC - Home',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login').then((component) => component.Login),
    title: 'IRCTC - Login',
  },
  {
    path: 'classic-enroll',
    loadComponent: () =>
      import('./register/register').then((component) => component.Register),
    title: 'IRCTC - Register',
  },
  {
    path: 'train-search',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./train-search/train-search').then((component) => component.TrainSearch),
    title: 'IRCTC - Search Trains',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
];
