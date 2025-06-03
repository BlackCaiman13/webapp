import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FournisseurService } from '../Services/fournisseur.service';
import { Fournisseur } from '../Models/fournisseur.model';

@Component({
  selector: 'app-fournisseur-evaluation',
  standalone: true,
  imports: [TableModule],
  template: `
    <h2>Évaluation des fournisseurs</h2>
    <p-table [value]="fournisseurs">
      <ng-template pTemplate="header">
        <tr>
          <th>Nom</th>
          <th>Code</th>
          <th>Rendement</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-fournisseur>
        <tr>
          <td>{{ fournisseur.nomFournisseur }}</td>
          <td>{{ fournisseur.codeFournisseur }}</td>
          <td>{{ fournisseur.rendement || 'N/A' }}</td>
        </tr>
      </ng-template>
    </p-table>
  `
})
export class FournisseurEvaluationComponent implements OnInit {
  fournisseurs: Fournisseur[] = [];

  constructor(private fournisseurService: FournisseurService) {}

  ngOnInit() {
    this.fournisseurService.getFournisseursAvecRendement().subscribe(data => this.fournisseurs = data);
  }
} 