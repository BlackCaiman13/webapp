import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule, Table } from 'primeng/table';
import { FilterService } from 'primeng/api';
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
import { ErrorService } from '../core/services/error.service';

interface EditMateriel {
  id?: number;
  nature: string;
  model: string;
  type?: { id: number; libelleType: string };
  constructeur?: { id: number; nomConstructeur: string };
  fournisseur?: { id: number; nomFournisseur: string };
  status?: number;
}

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
  providers: [MessageService, ConfirmationService, FilterService],
  templateUrl: './livraison.component.html'
})
export class LivraisonComponent implements OnInit, AfterViewInit {
  @ViewChild('dt') dt!: Table;
  
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
    private fournisseurService: FournisseurService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    Promise.all([
      this.loadTypes(),
      this.loadMateriels(),
      this.loadConstructeurs(),
      this.loadFournisseurs()
    ]).then(() => {
      this.getLivraisons();
    });
  }

  ngAfterViewInit() {
    // Ajouter le filtre personnalisé pour les dates une fois que la vue est initialisée
    if (this.dt && this.dt.filterService) {
      this.dt.filterService.register('dateHeure', (value: any, filter: any): boolean => {
        return this.customFilterDate(value, filter);
      });
    }
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

  loadConstructeurs(): Promise<void> {
    return new Promise((resolve) => {
      this.constructeurService.getAll().subscribe({
        next: (data) => {
          this.constructeurs = data;
          resolve();
        },
        error: () => {
          this.errorService.showError('Erreur lors du chargement des constructeurs');
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
          this.errorService.showError('Erreur lors du chargement des fournisseurs');
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
        error: () => {
          this.errorService.showError('Erreur lors du chargement des types');
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
    this.livraisonService.getAllLivraisons().subscribe({
      next: (data) => {
        this.livraisons = data;
      },
      error: () => {
        this.errorService.showError('Erreur lors du chargement des livraisons');
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
    this.errorService.showSuccess('Matériel ajouté à la livraison');
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
    this.newLivraison = {
      ...livraison,
      dateHeure: new Date(livraison.dateHeure),
      materiels: []
    };

    // Récupérer les matériels associés à cette livraison
    const materielsAssocies = this.mapToModel(
      this.materiels.filter(m => m.livraison === livraison.id)
    );

    // Assigner les matériels à la livraison
    this.newLivraison.materiels = materielsAssocies.map(materiel => ({
      nature: materiel.nature,
      model: materiel.model,
      type: materiel.type,
      constructeur: materiel.constructeur,
      fournisseur: materiel.fournisseur,
      status: materiel.status
    }));

    this.displayDialog = true;
    this.editMode = true;
  }

  private formatDateForBackend(date: Date): string {
    return LocalDateTime.ofInstant(
      Instant.ofEpochMilli(date.getTime()),
      ZoneId.SYSTEM
    ).toString();
  }

  saveLivraison() {
    this.submitted = true;
    const dateToSend = this.formatDateForBackend(this.newLivraison.dateHeure);

    if (this.editMode) {
      // Mise à jour d'une livraison existante
      this.livraisonService.updateLivraison(this.newLivraison.id!, {
        dateHeure: dateToSend
      }).subscribe({
        next: () => {
          // Mise à jour des matériels associés
          const updatePromises = this.newLivraison.materiels.map((materiel: EditMateriel) => 
            this.materielService.update(materiel.id!, {
              nature: materiel.nature,
              model: materiel.model,
              type: materiel.type?.id,
              constructeur: materiel.constructeur?.id,
              fournisseur: materiel.fournisseur?.id,
              status: materiel.status,
              livraison: this.newLivraison.id
            }).toPromise()
          );

          Promise.all(updatePromises).then(() => {
            Promise.all([
              this.loadMateriels(),
              this.loadTypes(),
              this.loadConstructeurs(),
              this.loadFournisseurs()
            ]).then(() => {
              this.displayDialog = false;
              this.getLivraisons();
              this.errorService.showSuccess('Livraison mise à jour avec succès');
            });
          }).catch(() => {
            this.errorService.showError('Erreur lors de la mise à jour des matériels');
          });
        },
        error: () => {
          this.errorService.showError('Erreur lors de la mise à jour de la livraison');
        }
      });
    } else {
      // Création d'une nouvelle livraison
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
            this.displayDialog = false;
            this.errorService.showSuccess('Livraison créée avec succès');
          });
        },
        error: () => {
          this.errorService.showError('Erreur lors de la création de la livraison');
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
              this.errorService.showSuccess('Livraison supprimée');
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
                this.errorService.showError(`Impossible de supprimer cette livraison car elle contient les matériels suivants : ${materielsDetails}`);
              } else {
                // Fallback si on ne trouve pas les matériels dans la liste locale
                this.errorService.showError('Impossible de supprimer cette livraison car elle contient des matériels associés');
              }
            } else {
              this.errorService.showError('Une erreur est survenue lors de la suppression');
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

  onDateSelect(value: any, filterCallback: Function) {
    if (value) {
      const date = new Date(value);
      filterCallback(date);
    } else {
      filterCallback(null);
    }
  }

  customFilterDate(value: any, filter: any): boolean {
    if (filter === undefined || filter === null || filter.trim() === '') {
      return true;
    }

    if (value === undefined || value === null) {
      return false;
    }

    const filterDate = new Date(filter);
    const valueDate = new Date(value);

    // Compare les dates sans tenir compte de l'heure
    return filterDate.getDate() === valueDate.getDate() &&
           filterDate.getMonth() === valueDate.getMonth() &&
           filterDate.getFullYear() === valueDate.getFullYear();
  }
}

