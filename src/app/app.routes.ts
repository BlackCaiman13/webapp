import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { authGuard } from './auth.guard';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AccessdenyComponent } from './accessdeny/accessdeny.component';

export const routes: Routes = [
  { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
  { path: 'landing-page', component: LandingPageComponent },
  {path: 'access-deny', component: AccessdenyComponent},
  { 
    path: '', 
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomeComponent }
    ]
  }

]