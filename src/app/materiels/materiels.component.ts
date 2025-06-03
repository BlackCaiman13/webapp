import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MaterielService } from '../Services/materiel.service';
import { MaterielDTO } from '../Dtos/materiel.dto';
import { StatusService } from '../Services/status.service';
import { EmployeService } from '../Services/employe.service';
import { Employe } from '../Models/employe.model';
import { Status } from '../Models/status.model';

interface MaterielWithEmploye extends MaterielDTO {
  employe_: Employe | null;
}

@Component({
  selector: 'app-materiels',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './materiels.component.html'
})
export class MaterielsComponent implements OnInit {
  materiels: MaterielWithEmploye[] = [];
  selectedMateriel: MaterielDTO | null = null;
  displayAttribuerDialog = false;
  displayChangerStatusDialog = false;
  employes: Employe[] = [];
  statuts: Status[] = [];
  selectedEmploye: Employe | null = null;
  selectedStatus: Status | null = null;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private materielService: MaterielService,
    private employeService: EmployeService,
    private statusService: StatusService
  ) {}

  ngOnInit() {
    // Charger d'abord les employés avant les matériels
    this.loadEmployes();
    this.loadStatus();
  }

  loadMateriels() {
    this.materielService.getAll().subscribe({
      next: (materiels) => {
        this.materiels = this.mapToModel(materiels);
        console.log("Materiels after mapping:", this.materiels);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors du chargement des matériels'
        });
      }
    });

    

  }

  loadEmployes() {
    this.employeService.getAll().subscribe({
      next: (employes) => {
        this.employes = employes;
        // Charger les matériels une fois que les employés sont chargés
        this.loadMateriels();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors du chargement des employés'
        });
      }
    });
  }

  mapToModel(materiels: MaterielDTO[]): MaterielWithEmploye[] {

      return materiels.map(materiel => ({
        id: materiel.id,
        nature: materiel.nature,
        model: materiel.model,
        type: materiel.type,
        constructeur: materiel.constructeur,
        fournisseur: materiel.fournisseur,
        status: materiel.status,
        employe_: this.employes.find(e => e.id === materiel.employe) || null,
        employe: materiel.employe,
        livraison: materiel.livraison

        
      }));

    }
  


  loadStatus() {
    this.statusService.getAll().subscribe({
      next: (statuts: Status[]) => {
        this.statuts = statuts;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors du chargement des statuts'
        });
      }
    });
  }

  showAttribuerDialog(materiel: MaterielDTO) {
    if (materiel.status !== 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attribution impossible',
        detail: 'Seuls les matériels neufs peuvent être attribués',
        life: 3000
      });
      return;
    }
    this.selectedMateriel = materiel;
    this.selectedEmploye = null;
    this.displayAttribuerDialog = true;
  }

  confirmerAttribution() {
    if (!this.selectedMateriel || !this.selectedEmploye) return;

    this.confirmationService.confirm({
      message: `Voulez-vous vraiment attribuer le matériel "${this.selectedMateriel.nature} - ${this.selectedMateriel.model}" à l'employé ${this.selectedEmploye.nomEmploye} ${this.selectedEmploye.prenomEmploye} ?`,
      header: "Confirmation d'attribution",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.materielService.attribuerMateriel(this.selectedMateriel!.id!, this.selectedEmploye!.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Matériel attribué avec succès',
              life: 3000
            });
            this.loadMateriels();
            this.displayAttribuerDialog = false;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: error.error?.message || 'Erreur lors de l\'attribution du matériel',
              life: 3000
            });
          }
        });
      }
    });
  }

  showChangerStatusDialog(materiel: MaterielDTO) {
    this.selectedMateriel = materiel;
    this.selectedStatus = null;
    this.displayChangerStatusDialog = true;
  }

  confirmerChangementStatus() {
    if (!this.selectedMateriel || !this.selectedStatus) return;

    let message = `Voulez-vous vraiment changer le status du matériel "${this.selectedMateriel.nature} - ${this.selectedMateriel.model}" à "${this.selectedStatus.libelleStatus}" ?`;
    if (this.selectedStatus.libelleStatus === 'EN_PANNE') {
      message += '\nCela révoquera automatiquement l\'attribution si le matériel est attribué.';
    }

    this.confirmationService.confirm({
      message: message,
      header: 'Confirmation du changement de status',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.materielService.changerEtat(this.selectedMateriel!.id!, this.selectedStatus!.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Status du matériel modifié avec succès',
              life: 3000
            });
            this.loadMateriels();
            this.displayChangerStatusDialog = false;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: error.error?.message || 'Erreur lors du changement de status',
              life: 3000
            });
          }
        });
      }
    });
  }

  revoquerAttribution(materiel: MaterielDTO) {
    if (!materiel.employe) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Révocation impossible',
        detail: 'Ce matériel n\'est attribué à aucun employé',
        life: 3000
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Voulez-vous vraiment révoquer l'attribution de ce matériel "${materiel.nature} - ${materiel.model}" ?`,
      header: 'Confirmation de révocation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.materielService.revoquerAttribution(materiel.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Attribution révoquée avec succès',
              life: 3000
            });
            this.loadMateriels();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: error.error?.message || 'Erreur lors de la révocation',
              life: 3000
            });
          }
        });
      }
    });
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 0:
        return 'status-neuf';
      case 1:
        return 'status-en-service';
      case 2:
        return 'status-en-panne';
      default:
        return '';
    }
  }
}
