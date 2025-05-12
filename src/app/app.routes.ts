import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
  { 
    path: '', 
    component: LandingPageComponent
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
