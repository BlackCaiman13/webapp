
import { AuthService } from '../Services/auth/auth.service';
import { HeaderComponent } from '../header/header.component';
import { AppSidebarComponent } from '../app.sidebar.component';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import {UserClaims} from '../Dtos/userclaims';
import { MaterielService } from '../Services/materiel.service';
import { Materiel } from '../Models/materiel.model';
import { MaterielDTO } from '../Dtos/materiel.dto';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    AppSidebarComponent,
    CommonModule,
    ChartModule,
    TableModule,
    TagModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  basicData: any;
  basicOptions: any;
  lineData: any;
  pieData: any;
  pieOptions: any;
  userInfo: UserClaims | null = null;
  materiels: MaterielDTO[] = [];

  constructor(
    private authService: AuthService,
    private materielService: MaterielService
  ) {}

  ngOnInit() {
    
    this.initCharts();
    this.materielService.getAll().subscribe(next => {
      this.materiels = next;
      console.log("en stock", this.materiels);
    });
   
  }



  private initCharts() {
    // Données pour le graphique en barres
    this.basicData = {
      labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
      datasets: [
        {
          label: 'Matériels En Panne',
          data: [65, 59, 80, 81, 56, 55],
          backgroundColor: '#42A5F5'
        },
        {
          label: 'Matériels Usagé',
          data: [28, 48, 40, 19, 86, 27],
          backgroundColor: '#66BB6A'
        }
      ]
    };

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    };

    // Données pour le graphique circulaire
    this.pieData = {
      labels: ['En Panne', 'Neuf', 'Usagé'],
      datasets: [
        {
          data: [300, 150, 100],
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726']
        }
      ]
    };

    this.pieOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: '#495057'
          }
        }
      }
    };
  }

  logout() {
    this.authService.logout();
  }
}