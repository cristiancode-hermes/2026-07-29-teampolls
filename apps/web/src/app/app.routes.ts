import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./layouts/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/login-page.component').then(m => m.LoginPageComponent) },
    ],
  },
  {
    path: 'register',
    loadComponent: () => import('./layouts/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/register-page.component').then(m => m.RegisterPageComponent) },
    ],
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard-page.component').then(m => m.DashboardPageComponent),
      },
      {
        path: 'polls/new',
        loadComponent: () => import('./pages/poll-create-page.component').then(m => m.PollCreatePageComponent),
      },
      {
        path: 'polls/:id',
        loadComponent: () => import('./pages/poll-detail-page.component').then(m => m.PollDetailPageComponent),
      },
    ],
  },
];
