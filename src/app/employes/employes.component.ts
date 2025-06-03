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
import { EmployeService } from '../Services/employe.service';
import { Employe } from '../Models/employe.model';
import { MaterielService } from '../Services/materiel.service';
import { MaterielDTO } from '../Dtos/materiel.dto';
import { Table } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-employes',
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
  templateUrl: './employes.component.html'
})
export class EmployesComponent implements OnInit {
  @ViewChild('dt') table!: Table;
  
  employes: Employe[] = [];
  selectedEmploye: Employe | null = null;
  employeDialog: boolean = false;
  loading: boolean = true;
  displayMaterielsDialog: boolean = false;
  materiels: MaterielDTO[] = [];
  employeMateriels: MaterielDTO[] = [];
  newEmploye: Employe = {} as Employe;
  isEditMode: boolean = false;

  constructor(
    private employeService: EmployeService,
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
      this.loadEmployes(),
      this.loadMateriels()
    ]).then(() => {
      this.loading = false;
    });
  }

  loadEmployes(): Promise<void> {
    return new Promise((resolve) => {
      this.employeService.getAll().subscribe({
        next: (data) => {
          this.employes = data;
          resolve();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors du chargement des employés'
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

  openNew() {
    this.newEmploye = {} as Employe;
    this.isEditMode = false;
    this.employeDialog = true;
  }

  editEmploye(employe: Employe) {
    this.newEmploye = { ...employe };
    this.isEditMode = true;
    this.employeDialog = true;
  }

  deleteEmploye(employe: Employe) {
    // Vérifier si l'employé a des matériels assignés
    const materielsAssignes = this.materiels.filter(m => m.employe === employe.id);
    if (materielsAssignes.length > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Suppression impossible',
        detail: 'Cet employé a des matériels qui lui sont assignés'
      });
      return;
    }

    this.confirmationService.confirm({
      message: 'Voulez-vous vraiment supprimer cet employé ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.employeService.delete(employe.id!).subscribe({
          next: () => {
            this.loadEmployes();
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Employé supprimé avec succès',
              life: 3000
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression de l\'employé'
            });
          }
        });
      }
    });
  }

  saveEmploye() {
    if (this.isEditMode) {
      this.employeService.update(this.newEmploye.id!, this.newEmploye).subscribe({
        next: () => {
          this.loadEmployes();
          this.employeDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Employé modifié avec succès',
            life: 3000
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la modification de l\'employé'
          });
        }
      });
    } else {
      this.employeService.create(this.newEmploye).subscribe({
        next: () => {
          this.loadEmployes();
          this.employeDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Employé créé avec succès',
            life: 3000
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la création de l\'employé'
          });
        }
      });
    }
  }

  showMateriels(employe: Employe) {
    this.selectedEmploye = employe;
    this.employeMateriels = this.materiels.filter(m => m.employe === employe.id);
    this.displayMaterielsDialog = true;
  }

  onGlobalFilter(event: Event) {
    this.table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
