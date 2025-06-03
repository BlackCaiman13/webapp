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
import { CreateFournisseurDTO } from '../Dtos/fournisseur.dto';

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
  @ViewChild('dt') table!: Table;
  
  fournisseurs: Fournisseur[] = [];
  selectedFournisseur: Fournisseur | null = null;
  fournisseurDialog: boolean = false;
  loading: boolean = true;
  displayMaterielsDialog: boolean = false;
  materiels: MaterielDTO[] = [];
  fournisseurMateriels: MaterielDTO[] = [];
  newFournisseur: Fournisseur = {} as Fournisseur;
  isEditMode: boolean = false;

  constructor(
    private fournisseurService: FournisseurService,
    private materielService: MaterielService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    Promise.all([
      this.loadFournisseurs(),
      this.loadMateriels()
    ]).then(() => {
      this.loading = false;
    });
  }

  loadFournisseurs(): Promise<void> {
    return new Promise((resolve) => {
      this.fournisseurService.getAll().subscribe({
        next: (data) => {
          this.fournisseurs = data;
          resolve();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors du chargement des fournisseurs'
          });
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
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors du chargement des matériels'
          });
          resolve();
        }
      });
    });
  }

  onGlobalFilter(event: any) {
    this.table.filterGlobal(event.target.value, 'contains');
  }

  openNew() {
    this.newFournisseur = {} as Fournisseur;
    this.isEditMode = false;
    this.fournisseurDialog = true;
  }

  editFournisseur(fournisseur: Fournisseur) {
    this.newFournisseur = { ...fournisseur };
    this.isEditMode = true;
    this.fournisseurDialog = true;
  }

  deleteFournisseur(fournisseur: Fournisseur) {
    // Vérifier si le fournisseur a des matériels assignés
    const materielsAssignes = this.materiels.filter(m => m.fournisseur === fournisseur.id);
    if (materielsAssignes.length > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Suppression impossible',
        detail: 'Ce fournisseur a des matériels qui lui sont assignés'
      });
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
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Fournisseur supprimé avec succès',
              life: 3000
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression du fournisseur'
            });
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
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Fournisseur modifié avec succès',
            life: 3000
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la modification du fournisseur'
          });
        }
      });
    } else {
      const createFournisseurDTO: CreateFournisseurDTO = {
        nomFournisseur: this.newFournisseur.nomFournisseur,
        codeFournisseur: this.newFournisseur.codeFournisseur,
        etatId: this.newFournisseur.etat
      };

      this.fournisseurService.create(createFournisseurDTO).subscribe({
        next: () => {
          this.loadFournisseurs();
          this.fournisseurDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Fournisseur créé avec succès',
            life: 3000
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la création du fournisseur'
          });
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
