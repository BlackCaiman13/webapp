import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AuthGuard } from './Services/auth/auth.guard';
import { AdminGuard } from './Services/auth/admin.guard';
import { DirecteurGuard } from './Services/auth/directeur.guard';
import { ExploitantGuard } from './Services/auth/exploitant.guard';
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
        canMatch: [AdminGuard, ExploitantGuard]
      },
      { 
        path: 'materiels', 
        component: MaterielsComponent,
        canMatch: [AdminGuard, ExploitantGuard]
      },
      { 
        path: 'employes',
        component: EmployesComponent,
        canMatch: [AdminGuard, ExploitantGuard]
      },
      { 
        path: 'fournisseurs',
        component: FournisseursComponent,
        canMatch: [AdminGuard, DirecteurGuard, ExploitantGuard]
      }
    ]
  },
  { path: '**', component: PageNotFoundComponent },
  
]