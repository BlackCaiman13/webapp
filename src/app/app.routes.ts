import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AuthGuard } from './Services/auth/auth.guard';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AccessdenyComponent } from './accessdeny/accessdeny.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LivraisonComponent } from './livraison/livraison.component';
import { AttributionMaterielComponent } from './exploitation/attribution-materiel.component';
import { RevocationAttributionComponent } from './exploitation/revocation-attribution.component';
import { CreationMaterielsMasseComponent } from './exploitation/creation-materiels-masse.component';
import { ChangementEtatMaterielComponent } from './exploitation/changement-etat-materiel.component';
import { MaterielsAttribuesDirecteurComponent } from './directeur/materiels-attribues-directeur.component';
import { FournisseurEvaluationComponent } from './directeur/fournisseur-evaluation.component';
import { MaterielsComponent } from './materiels/materiels.component';

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
      { path: 'livraison', component: LivraisonComponent },
      { path: 'materiels', component: MaterielsComponent },
      { path: 'attribution-materiel', component: AttributionMaterielComponent },
      { path: 'changement-etat-materiel', component: ChangementEtatMaterielComponent },
      { path: 'creation-materiels-masse', component: CreationMaterielsMasseComponent },
      { path: 'revocation-attribution', component: RevocationAttributionComponent },
      { path: 'materiels-attribues-directeur', component: MaterielsAttribuesDirecteurComponent },
      { path: 'fournisseur-evaluation', component: FournisseurEvaluationComponent }
    ]
  },

  { path: '**', component: PageNotFoundComponent },

]