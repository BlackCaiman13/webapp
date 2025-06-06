import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Table } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ErrorService } from '../core/services/error.service';

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
    ConfirmDialogModule,
    TooltipModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './materiels.component.html'
})
export class MaterielsComponent implements OnInit {
  @ViewChild('dt') table!: Table;

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
    private statusService: StatusService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    // Charger les données initiales
    Promise.all([
      this.loadEmployes(),
      this.loadStatus()
    ]).then(() => {
      this.loadMateriels();
    });
  }

  loadMateriels() {
    this.materielService.getAll().subscribe({
      next: (materiels) => {
        this.materiels = this.mapToModel(materiels);
      },
      error: () => {
        this.errorService.showError('Erreur lors du chargement des matériels');
      }
    });
  }

  loadEmployes() {
    return new Promise<void>((resolve) => {
      this.employeService.getAll().subscribe({
        next: (employes) => {
          this.employes = employes;
          resolve();
        },
        error: () => {
          this.errorService.showError('Erreur lors du chargement des employés');
          resolve();
        }
      });
    });
  }

  mapToModel(materiels: MaterielDTO[]): MaterielWithEmploye[] {
    return materiels.map(materiel => ({
      ...materiel,
      employe_: this.employes.find(e => e.id === materiel.employe) || null,
    }));
  }

  loadStatus() {
    return new Promise<void>((resolve) => {
      this.statusService.getAll().subscribe({
        next: (statuts: Status[]) => {
          this.statuts = statuts;
          resolve();
        },
        error: () => {
          this.errorService.showError('Erreur lors du chargement des statuts');
          resolve();
        }
      });
    });
  }

  showAttribuerDialog(materiel: MaterielDTO) {
    if (materiel.status !== 0) {
      this.errorService.showWarning('Seuls les matériels neufs peuvent être attribués');
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
            this.errorService.showSuccess('Matériel attribué avec succès');
            this.loadMateriels();
            this.displayAttribuerDialog = false;
          },
          error: (error) => {
            this.errorService.showError(error.error?.message || "Erreur lors de l'attribution du matériel");
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
      message,
      header: 'Confirmation du changement de status',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.materielService.changerEtat(this.selectedMateriel!.id!, this.selectedStatus!.id!).subscribe({
          next: () => {
            this.errorService.showSuccess('Status du matériel modifié avec succès');
            this.loadMateriels();
            this.displayChangerStatusDialog = false;
          },
          error: (error) => {
            this.errorService.showError(error.error?.message || 'Erreur lors du changement de status');
          }
        });
      }
    });
  }

  revoquerAttribution(materiel: MaterielDTO) {
    if (!materiel.employe) {
      this.errorService.showWarning('Ce matériel n\'est attribué à aucun employé');
      return;
    }

    this.confirmationService.confirm({
      message: `Voulez-vous vraiment révoquer l'attribution de ce matériel "${materiel.nature} - ${materiel.model}" ?`,
      header: 'Confirmation de révocation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.materielService.revoquerAttribution(materiel.id!).subscribe({
          next: () => {
            this.errorService.showSuccess('Attribution révoquée avec succès');
            this.loadMateriels();
          },
          error: (error) => {
            this.errorService.showError(error.error?.message || 'Erreur lors de la révocation');
          }
        });
      }
    });
  }

  toggleStatus(materiel: MaterielDTO) {
    const newStatusId = materiel.status === 2 ? 1 : 2; // 2 = en panne, 1 = en service
    const action = materiel.status === 2 ? 'remettre en service' : 'mettre en panne';

    this.confirmationService.confirm({
      message: `Voulez-vous vraiment ${action} le matériel "${materiel.nature} - ${materiel.model}" ?`,
      header: 'Confirmation du changement de statut',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.materielService.changerEtat(materiel.id!, newStatusId).subscribe({
          next: () => {
            this.errorService.showSuccess(`Matériel ${action} avec succès`);
            this.loadMateriels();
          },
          error: (error) => {
            this.errorService.showError(error.error?.message || 'Erreur lors du changement de statut');
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
        return 'status-neuf';
    }
  }

  onGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.table.filterGlobal(filterValue, 'contains');
  }

  clear(table: Table) {
    table.clear();
  }

  confirmerSuppression(materiel: MaterielWithEmploye) {
    if (materiel.employe_) {
      this.errorService.showError('Impossible de supprimer un matériel attribué à un employé');
      return;
    }

    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le matériel ${materiel.nature} - ${materiel.model} ?`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (materiel.id !== undefined) {
          this.materielService.delete(materiel.id).subscribe({
            next: () => {
              this.errorService.showSuccess('Le matériel a été supprimé avec succès');
              this.loadMateriels();
            },
            error: () => {
              this.errorService.showError('Une erreur est survenue lors de la suppression du matériel');
            }
          });
        } else {
          this.errorService.showError("Impossible de supprimer : l'identifiant du matériel est manquant.");
        }
      }
    });
  }
}
