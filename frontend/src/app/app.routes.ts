import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/task1',
    pathMatch: 'full'
  },
  {
    path: 'task1',
    loadComponent: () => import('./task1/task1.component').then(m => m.Task1Component)
  },
  {
    path: 'task2',
    loadComponent: () => import('./task2/task2.component').then(m => m.Task2Component)
  }
];

