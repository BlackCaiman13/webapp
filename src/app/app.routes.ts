import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AuthGuard } from './Services/auth/auth.guard';
import { CombinedGuard } from './Services/auth/combined.guard';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AccessdenyComponent } from './accessdeny/accessdeny.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LivraisonComponent } from './livraison/livraison.component';
import { MaterielsComponent } from './materiels/materiels.component';
import { EmployesComponent } from './employes/employes.component';
import { FournisseursComponent } from './fournisseurs/fournisseurs.component';
import { AuthService } from './Services/auth/auth.service';

export const routes: Routes = [
  { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
  { path: 'landing-page', component: LandingPageComponent },
  {path: 'access-deny', component: AccessdenyComponent},
  { 
    path: '', 
    component: MainLayoutComponent,
    canMatch: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { 
        path: 'livraison', 
        component: LivraisonComponent,
        canActivate: [CombinedGuard],
        data: { roles: ['admin', 'exploitant'] }
      },
      { 
        path: 'materiels', 
        component: MaterielsComponent,
        canActivate: [CombinedGuard],
        data: { roles: ['admin', 'exploitant'] }
      },
      { 
        path: 'employes',
        component: EmployesComponent,
        canActivate: [CombinedGuard],
        data: { roles: ['admin', 'exploitant'] }
      },
      { 
        path: 'fournisseurs',
        component: FournisseursComponent,
        canActivate: [CombinedGuard],
        data: { roles: ['admin', 'directeur'] }
      }
    ]
  },
  { path: '**', component: PageNotFoundComponent },
  
]