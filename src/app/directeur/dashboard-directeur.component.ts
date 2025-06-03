// import { Component, OnInit } from '@angular/core';
// import { ChartModule } from 'primeng/chart';
// import { StatistiqueService } from '../Services/';

// @Component({
//   selector: 'app-dashboard-directeur',
//   standalone: true,
//   imports: [ChartModule],
//   template: `
//     <h2>Statistiques globales</h2>
//     <p-chart type="pie" [data]="pieData"></p-chart>
//     <p-chart type="bar" [data]="barData"></p-chart>
//   `
// })
// export class DashboardDirecteurComponent implements OnInit {
//   pieData: any;
//   barData: any;

//   constructor(private statsService: StatistiqueService) {}

//   ngOnInit() {
//     this.statsService.getStats().subscribe(stats => {
//       this.pieData = stats.pie;
//       this.barData = stats.bar;
//     });
//   }
// } 