import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { AppSidebarComponent } from '../app.sidebar.component';
import { MaterielDTO } from '../Dtos/materiel.dto';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { DashboardService } from '../Services/dashboard.service';
import { DashboardData, FournisseurStat } from '../Models/stats.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../Services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    AppSidebarComponent,
    CommonModule,
    TableModule,
    TagModule,
    ChartModule,
    CardModule,
    RatingModule,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  basicData: any;
  basicOptions: any;
  pieData: any;
  pieOptions: any;
  materiels: MaterielDTO[] = [];
  totalEnPanne: number = 0;
  totalNeufs: number = 0;
  totalEnService: number = 0;
  statsFournisseurs: FournisseurStat[] = [];
  fournisseursChartData: any;
  fournisseursChartOptions: any;
  selectedFournisseur: FournisseurStat | null = null;
  admin : boolean = false;
  direxteur : boolean = false;

  constructor(private dashboardService: DashboardService, private authService: AuthService) {}

  ngOnInit() {
    this.loadDashboardData();
    this.initChartOptions();
    this.admin = this.authService.isAdmin();
    this.direxteur = this.authService.isDirecteur();
  }

  private loadDashboardData() {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.totalEnPanne = data.totalMaterielsEnPanne;
        this.totalNeufs = data.totalMaterielsNeufs;
        this.totalEnService = data.totalMaterielsEnService;
        this.materiels = data.dernieresActivites;
        this.updateCharts(data);
        
        // Traitement des statistiques fournisseurs
        this.statsFournisseurs = data.statsFournisseurs;
        this.initFournisseursChart();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données du dashboard:', error);
      }
    });
  }

  private updateCharts(data: DashboardData) {
    // Configuration du graphique en barres
    const labels = data.evolutionParMois.map(m => {
      const date = new Date(m.mois);
      return date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
    });
    this.basicData = {
      labels: labels,
      datasets: [
        {
          label: 'Neuf',
          backgroundColor: '#FFA726',
          data: data.evolutionParMois.map(m => m.neuf)
        },
        {
          label: 'En Service',
          backgroundColor: '#66BB6A',
          data: data.evolutionParMois.map(m => m.enService)
        },
        {
          label: 'En Panne',
          backgroundColor: '#42A5F5',
          data: data.evolutionParMois.map(m => m.enPanne)
        }
      ]
    };

    // Configuration du graphique circulaire
    this.pieData = {
      labels: ['Neuf', 'En Service', 'En Panne'],
      datasets: [
        {
          data: [
            data.totalMaterielsNeufs,
            data.totalMaterielsEnService,
            data.totalMaterielsEnPanne
          ],
          backgroundColor: ['#FFA726', '#66BB6A', '#42A5F5']
        }
      ]
    };
  }

  private initChartOptions() {
    this.basicOptions = {
      plugins: {
        legend: {
          labels: { color: '#495057' }
        },
        tooltip: {
          callbacks: {
            title: (tooltipItems: any) => {
              return tooltipItems[0].label;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { 
            color: '#495057',
            maxRotation: 45,
            minRotation: 45
          },
          grid: { color: '#ebedef' }
        },
        y: {
          ticks: { 
            color: '#495057',
            stepSize: 1
          },
          grid: { color: '#ebedef' },
          title: {
            display: true,
            text: 'Nombre de matériels',
            color: '#495057'
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };

    this.pieOptions = {
      plugins: {
        legend: {
          labels: { color: '#495057' }
        }
      }
    };
  }

  private initFournisseursChart() {
    // Trier les fournisseurs par total de matériels
    const sortedFournisseurs = [...this.statsFournisseurs].sort((a, b) => b.totalMateriels - a.totalMateriels);
    const topFournisseurs = sortedFournisseurs.slice(0, 10); // Limiter aux 10 premiers

    const labels = topFournisseurs.map(f => f.nomFournisseur);
    const tauxPannes = topFournisseurs.map(f => f.tauxPanne);
    const totalMateriels = topFournisseurs.map(f => f.totalMateriels);

    this.fournisseursChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Taux de panne (%)',
          data: tauxPannes,
          backgroundColor: '#FF6384',
          yAxisID: 'y',
          order: 1,
          type: 'line'
        },
        {
          label: 'Total Matériels',
          data: totalMateriels,
          backgroundColor: '#36A2EB',
          yAxisID: 'y1',
          order: 2,
          type: 'bar'
        }
      ]
    };

    this.fournisseursChartOptions = {
      plugins: {
        legend: {
          labels: { color: '#495057' }
        },
        title: {
          display: true,
          text: 'Performance des Fournisseurs (Top 10)',
          color: '#495057'
        }
      },
      responsive: true,
      scales: {
        x: {
          ticks: { color: '#495057' },
          grid: { color: '#ebedef' }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: { 
            color: '#495057',
            callback: (value: any) => {
              return value + '%';
            }
          },
          grid: { color: '#ebedef' },
          title: {
            display: true,
            text: 'Taux de Panne (%)',
            color: '#495057'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: {
            drawOnChartArea: false
          },
          ticks: { color: '#495057' },
          title: {
            display: true,
            text: 'Nombre de Matériels',
            color: '#495057'
          }
        }
      }
    };
  }

  getFournisseurRating(fournisseur: FournisseurStat): number {
    // Calculer une note sur 5 basée sur plusieurs critères
    const tauxPanneScore = Math.max(0, 5 - (fournisseur.tauxPanne / 10)); // Moins de pannes = meilleur score
    const volumeScore = Math.min(5, fournisseur.totalMateriels / 50); // Plus de matériels = meilleur score (ajusté à 50)
    const diversiteScore = Math.min(5, Object.keys(fournisseur.repartitionStatus).length); // Diversité des statuts
    
    // Calculer le score final (pondéré)
    const score = (tauxPanneScore * 0.4) + // Le taux de panne compte pour 40%
                 (volumeScore * 0.4) +     // Le volume compte pour 40%
                 (diversiteScore * 0.2);   // La diversité compte pour 20%
    
    return Math.round(score);
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'Neuf': return 'success';
      case 'En Service': return 'info';
      case 'En Panne': return 'danger';
      default: return 'warning';
    }
  }

  getFournisseurStatusSeverity(tauxPanne: number): string {
    if (tauxPanne > 30) return 'danger';
    if (tauxPanne > 15) return 'warning';
    if (tauxPanne > 5) return 'info';
    return 'success';
  }
}