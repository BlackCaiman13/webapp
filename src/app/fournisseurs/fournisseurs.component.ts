import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FournisseurService } from '../Services/fournisseur.service';
import { Fournisseur } from '../Models/fournisseur.model';
import { MaterielService } from '../Services/materiel.service';
import { MaterielDTO } from '../Dtos/materiel.dto';
import { Table } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { ErrorService } from '../core/services/error.service';

@Component({
  selector: 'app-fournisseurs',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    ButtonModule,
    FormsModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialogModule,
    InputTextModule,
    ProgressSpinnerModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './fournisseurs.component.html'
})
export class FournisseursComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  fournisseurs: Fournisseur[] = [];
  fournisseurDialog: boolean = false;
  deleteFournisseurDialog: boolean = false;
  isEditMode: boolean = false;
  submitted: boolean = false;
  displayMaterielsDialog = false;
  materiels: MaterielDTO[] = [];
  
  newFournisseur: Fournisseur = {
    nomFournisseur: '',
    codeFournisseur: '',
    etat: 0
  } as Fournisseur;

  selectedFournisseur: Fournisseur | null = null;
  fournisseurMateriels: MaterielDTO[] = [];

  constructor(
    private fournisseurService: FournisseurService,
    private materielService: MaterielService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    await this.loadMateriels();
    await this.loadFournisseurs();
  }

  loadFournisseurs(): Promise<void> {
    return new Promise((resolve) => {
      this.fournisseurService.getAll().subscribe({
        next: (data) => {
          this.fournisseurs = data.map(f => ({
            ...f,
            nombreMateriels: this.materiels.filter(m => m.fournisseur === f.id).length
          }));
          resolve();
        },
        error: (error) => {
          this.errorService.showError('Erreur lors du chargement des fournisseurs');
          console.error('Erreur lors du chargement:', error);
          resolve();
        }
      });
    });
  }

  loadMateriels(): Promise<void> {
    return new Promise((resolve) => {
      this.materielService.getAll().subscribe({
        next: (data) => {
          this.materiels = data;
          resolve();
        },
        error: () => {
          this.errorService.showError('Erreur lors du chargement des matériels');
          resolve();
        }
      });
    });
  }

  onGlobalFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dt.filterGlobal(filterValue, 'contains');
  }

  openNew() {
    this.newFournisseur = {
      nomFournisseur: '',
      codeFournisseur: '',
      etat: 0
    } as Fournisseur;
    this.isEditMode = false;
    this.submitted = false;
    this.fournisseurDialog = true;
  }

  editFournisseur(fournisseur: Fournisseur) {
    this.newFournisseur = { ...fournisseur };
    this.fournisseurDialog = true;
    this.isEditMode = true;
  }

  deleteFournisseur(fournisseur: Fournisseur) {
    // Vérifier si le fournisseur a des matériels assignés
    const materielsAssignes = this.materiels.filter(m => m.fournisseur === fournisseur.id);
    if (materielsAssignes.length > 0) {
      this.errorService.showError('Ce fournisseur a des matériels qui lui sont assignés');
      return;
    }

    this.confirmationService.confirm({
      message: 'Voulez-vous vraiment supprimer ce fournisseur ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.fournisseurService.delete(fournisseur.id!).subscribe({
          next: () => {
            this.loadFournisseurs();
            this.errorService.showSuccess('Fournisseur supprimé avec succès');
          },
          error: () => {
            this.errorService.showError('Erreur lors de la suppression du fournisseur');
          }
        });
      }
    });
  }

  saveFournisseur() {
    if (this.isEditMode) {
      this.fournisseurService.update(this.newFournisseur.id!, this.newFournisseur).subscribe({
        next: () => {
          this.loadFournisseurs();
          this.fournisseurDialog = false;
          this.errorService.showSuccess('Fournisseur modifié avec succès');
        },
        error: () => {
          this.errorService.showError('Erreur lors de la modification du fournisseur');
        }
      });
    } else {
      const createFournisseurDTO = {
        nomFournisseur: this.newFournisseur.nomFournisseur,
        codeFournisseur: this.newFournisseur.codeFournisseur,
        etatId: this.newFournisseur.etat
      };

      this.fournisseurService.create(createFournisseurDTO).subscribe({
        next: () => {
          this.loadFournisseurs();
          this.fournisseurDialog = false;
          this.errorService.showSuccess('Fournisseur créé avec succès');
        },
        error: () => {
          this.errorService.showError('Erreur lors de la création du fournisseur');
        }
      });
    }
  }

  showMateriels(fournisseur: Fournisseur) {
    this.selectedFournisseur = fournisseur;
    this.fournisseurMateriels = this.materiels.filter(m => m.fournisseur === fournisseur.id);
    this.displayMaterielsDialog = true;
  }
}
