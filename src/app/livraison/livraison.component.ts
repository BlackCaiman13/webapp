import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule, Table } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { LivraisonService } from '../Services/livraison.service';
import { TypeService } from '../Services/type.service';
import { Livraison } from '../Models/livraison.model';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MaterielService } from '../Services/materiel.service';
import { Materiel } from '../Models/materiel.model';
import { LivraisonDTO } from '../Dtos/livraison.dto';
import { InputTextModule } from 'primeng/inputtext';
import { MaterielDTO } from '../Dtos/materiel.dto';
import { ConstructeurService } from '../Services/constructeur.service';
import { FournisseurService } from '../Services/fournisseur.service';
import { LocalDateTime, convert, Instant, ZoneId } from '@js-joda/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@Component({
  selector: 'app-livraison',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    ButtonModule,
    MultiSelectModule,
    CalendarModule,
    FormsModule,
    ToastModule,
    DropdownModule,
    ToolbarModule,
    ConfirmDialogModule,
    InputTextModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './livraison.component.html'
})
export class LivraisonComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  loading: boolean = true;
  livraisons: LivraisonDTO[] = [];
  selectedLivraisons: LivraisonDTO[] = [];
  livraisonDialog = false;
  deleteLivraisonDialog = false;
  editMode = false;
  submitted = false;
  livraison: LivraisonDTO = {} as LivraisonDTO;
  materiels: MaterielDTO[] = [];
  selectedMateriels: any[] = [];
  displayDialog: boolean = false;
  displayMaterielDialog: boolean = false;
  displayDetailsDialog: boolean = false;
  types: any[] = [];
  selectedLivraison: LivraisonDTO | null = null;
  materiel: MaterielDTO = {} as MaterielDTO;
  newLivraison: any = {
    dateHeure: this.getLocalDateTime(),
    materiels: [] as any[]
  };

  newMateriel: any = {
    nature: '',
    model: '',
    type: null,
    constructeurId: null,
    fournisseurId: null,
    statusId: null
  };

  constructeurs: any[] = [];
  fournisseurs: any[] = [];

  constructor(
    private messageService: MessageService,
    private livraisonService: LivraisonService,
    private typeService: TypeService,
    private materielService: MaterielService,
    private confirmationService: ConfirmationService,
    private constructeurService: ConstructeurService,
    private fournisseurService: FournisseurService
  ) {}

  ngOnInit() {
    this.loading = true;
    // Charger toutes les données nécessaires en parallèle
    Promise.all([
      this.loadTypes(),
      this.loadMateriels(),
      this.loadConstructeurs(),
      this.loadFournisseurs()
    ]).then(() => {
      this.getLivraisons();
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

  loadConstructeurs(): Promise<void> {
    return new Promise((resolve) => {
      this.constructeurService.getAll().subscribe({
        next: (data) => {
          this.constructeurs = data;
          resolve();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors du chargement des constructeurs'
          });
          resolve();
        }
      });
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


  loadTypes(): Promise<void> {
    return new Promise((resolve) => {
      this.typeService.getAll().subscribe({
        next: (types) => {
          this.types = types;
          resolve();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors du chargement des types'
          });
          resolve();
        }
      });
    });
  }





  showDetails(livraison: LivraisonDTO): void {
    this.selectedLivraison = livraison;
    this.selectedMateriels = this.mapToModel(this.materiels.filter(m => m.livraison === livraison.id));
    this.displayDetailsDialog = true;
  }

  mapToModel(listMateriels: MaterielDTO[]): Materiel[] {
    return listMateriels.map(m => ({
      id: m.id ?? 0,
      nature: m.nature,
      model: m.model,
      type: this.types.find(t => t.id === m.type),
      constructeur: this.constructeurs.find(c => c.id === m.constructeur),
      fournisseur: this.fournisseurs.find(f => f.id === m.fournisseur),
      status: m.status,
      employe: m.employe,
      livraison: m.livraison
    }));
  }

  showDialog() {
    this.newLivraison = {
      dateHeure: this.getLocalDateTime(),
      materiels: []
    };
    this.displayDialog = true;
  }

  getLivraisons() {
    this.loading = true;
    this.livraisonService.getAllLivraisons().subscribe({
      next: (data) => {
        this.livraisons = data;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors du chargement des livraisons'
        });
        this.loading = false;
      }
    });
  }

  showNewMaterielDialog() {
    this.newMateriel = {
      nature: '',
      model: '',
      type: null,
      constructeur: null,
      fournisseur: null,
      status: null
    };
    this.displayMaterielDialog = true;
  }

  isNewMaterielValid() {
    return this.newMateriel.nature && 
           this.newMateriel.model && 
           this.newMateriel.type;
  }

  addMateriel() {
    this.newLivraison.materiels.push({
      nature: this.newMateriel.nature,
      model: this.newMateriel.model,
      type: this.newMateriel.type,
      fournisseur: this.newMateriel.fournisseur,
      constructeur: this.newMateriel.constructeur,
      statusid: this.newMateriel.statusid,
    });
    this.displayMaterielDialog = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Matériel ajouté à la livraison'
    });

    
  }

  removeMateriel(index: number) {
    this.newLivraison.materiels.splice(index, 1);
  }

  openNew() {
    this.livraison = { dateHeure: this.getLocalDateTime().toISOString() } as LivraisonDTO;
    this.selectedMateriels = [];
    this.submitted = false;
    this.livraisonDialog = true;
    this.editMode = false;
  }

  editLivraison(livraison: LivraisonDTO) {
    this.livraison = { ...livraison };
    this.selectedMateriels = [ ];
    this.livraisonDialog = true;
    this.editMode = true;
  }

  // Fonction utilitaire pour formater la date et l'heure au format souhaité


  private formatDateForBackend(date: Date): string {
    return LocalDateTime.ofInstant(
      Instant.ofEpochMilli(date.getTime()),
      ZoneId.SYSTEM
    ).toString();
  }

  saveLivraison() {
    this.submitted = true;
    if (this.editMode && this.livraison.id) {
      const dateToSend = this.formatDateForBackend(new Date(this.livraison.dateHeure));
      this.livraisonService.updateLivraison(this.livraison.id, { 
        ...this.livraison, 
        dateHeure: dateToSend,
        materiels: this.selectedMateriels.map(m => m.id!) 
      }).subscribe(() => {
        this.getLivraisons();
        this.livraisonDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Livraison modifiée', life: 3000 });
      });
    } else {
      // Formater la date avant l'envoi
      const dateToSend = this.formatDateForBackend(this.newLivraison.dateHeure);
      
      this.livraisonService.createLivraisonAvecMateriels(
        { dateHeure: dateToSend },
        this.newLivraison.materiels
      ).subscribe({
        next: () => {
          Promise.all([
            this.loadMateriels(),
            this.loadTypes(),
            this.loadConstructeurs(),
            this.loadFournisseurs()
          ]).then(() => {
            this.getLivraisons();
            this.livraisonDialog = false;
            this.displayDialog = false;
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Succès', 
              detail: 'Livraison créée', 
              life: 3000 
            });
          });
        },
        error: (error) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Erreur', 
            detail: 'Erreur lors de la création de la livraison', 
            life: 3000 
          });
        }
      });
    }
  }

  deleteLivraison(livraison: LivraisonDTO) {
    if (!livraison.id) return;
    
    this.confirmationService.confirm({
      message: 'Voulez-vous supprimer cette livraison ?',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.livraisonService.deleteLivraison(livraison.id!).subscribe({
          next: () => {
            Promise.all([
              this.loadMateriels(),
              this.loadTypes(),
              this.loadConstructeurs(),
              this.loadFournisseurs()
            ]).then(() => {
              this.getLivraisons();
              this.messageService.add({ 
                severity: 'success', 
                summary: 'Succès', 
                detail: 'Livraison supprimée', 
                life: 3000 
              });
            });
          },
          error: (error) => {
            if (error.error?.code === 'REFERENCED' && error.error?.message) {
              // Extraire l'ID du matériel du message d'erreur
              const [errorKey, materielId] = error.error.message.split(',');
              
              // Récupérer tous les matériels de la livraison
              const materielsAssocies = this.mapToModel(this.materiels.filter(m => m.livraison === livraison.id));
             
              if (materielsAssocies.length > 0) {
                const materielsDetails = materielsAssocies.map(m => `${m.nature} (${m.model})`).join(', ');
                this.messageService.add({ 
                  severity: 'error', 
                  summary: 'Suppression impossible', 
                  detail: `Impossible de supprimer cette livraison car elle contient les matériels suivants : ${materielsDetails}`, 
                  life: 7000 
                });
              } else {
                // Fallback si on ne trouve pas les matériels dans la liste locale
                this.messageService.add({ 
                  severity: 'error', 
                  summary: 'Suppression impossible', 
                  detail: 'Impossible de supprimer cette livraison car elle contient des matériels associés', 
                  life: 5000 
                });
              }
            } else {
              this.messageService.add({ 
                severity: 'error', 
                summary: 'Erreur', 
                detail: 'Une erreur est survenue lors de la suppression', 
                life: 5000 
              });
            }
          }
        });
      }
    });
  }

  hideDialog() {
    this.livraisonDialog = false;
    this.submitted = false;
  }

  private getLocalDateTime(): Date {
    const localDateTime = LocalDateTime.now();
    return convert(localDateTime).toDate();
  }

  onGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dt.filterGlobal(filterValue, 'contains');
  }
}

