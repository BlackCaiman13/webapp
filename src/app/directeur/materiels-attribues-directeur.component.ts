import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MaterielService } from '../Services/materiel.service';
import { Materiel } from '../Models/materiel.model';
import { PanneService } from '../Services/panne.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterielDTO } from '../Dtos/materiel.dto';

@Component({
  selector: 'app-materiels-attribues-directeur',
  standalone: true,
  imports: [TableModule, DialogModule, ButtonModule, FormsModule, CommonModule],
  template: `
    <h2>Mes matériels attribués</h2>
    <p-table [value]="materiels">
      <ng-template pTemplate="header">
        <tr>
          <th>Nature</th>
          <th>Modèle</th>
          <th>État</th>
          <th>Action</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-mat>
        <tr>
          <td>{{ mat.nature }}</td>
          <td>{{ mat.model }}</td>
          <td>{{ mat.statusLabel }}</td>
          <td>
            <button pButton label="Signaler une panne" (click)="ouvrirDialog(mat)"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>
    <p-dialog header="Signaler une panne" [(visible)]="dialogVisible">
      <div *ngIf="materielSelectionne">
        <p>Nature : {{ materielSelectionne.nature }}</p>
        <input type="text" pInputText [(ngModel)]="descriptionPanne" placeholder="Description de la panne" />
        <button pButton label="Envoyer" (click)="signalerPanne()"></button>
      </div>
    </p-dialog>
  `
})
export class MaterielsAttribuesDirecteurComponent implements OnInit {
  materiels: MaterielDTO[] = [];
  dialogVisible = false;
  materielSelectionne: MaterielDTO | null = null;
  descriptionPanne = '';

  constructor(private materielService: MaterielService, private panneService: PanneService) {}

  ngOnInit() {
    this.materielService.getMaterielsAttribuesDirecteur().subscribe(data => this.materiels = data);
  }

  ouvrirDialog(mat: MaterielDTO) {
    this.materielSelectionne = mat;
    this.dialogVisible = true;
    this.descriptionPanne = '';
  }

  signalerPanne() {
    if (this.materielSelectionne && this.descriptionPanne) {
      this.panneService.signalerPanne(this.materielSelectionne.id!, this.descriptionPanne).subscribe(() => {
        this.dialogVisible = false;
        // Afficher une notification PrimeNG Toast ici si besoin
      });
    }
  }
} 