import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { APIURL } from '../app.config';
import { DashboardData } from '../Models/stats.model';
import { MaterielDTO } from '../Dtos/materiel.dto';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = APIURL + '/api/dashboard';

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    // Récupérer toutes les données du tableau de bord en parallèle
    return forkJoin({
      stats: this.http.get<Record<string, number>>(`${this.apiUrl}/statistiques`),
      activites: this.http.get<MaterielDTO[]>(`${this.apiUrl}/dernieres-activites`),
      statsFournisseurs: this.http.get<any[]>(`${this.apiUrl}/fournisseurs-stats`),
      evolution: this.http.get<any>(`${this.apiUrl}/evolution-mensuelle`)
    }).pipe(
      map(({ stats, activites, statsFournisseurs, evolution }) => {
        return {
          totalMaterielsEnPanne: stats['totalMaterielsEnPanne'],
          totalMaterielsNeufs: stats['totalMaterielsNeufs'],
          totalMaterielsEnService: stats['totalMaterielsEnService'],
          dernieresActivites: activites,
          statsFournisseurs: statsFournisseurs,
          evolutionParMois: this.transformEvolutionData(evolution),
          repartitionParStatus: stats['repartitionParStatus'] || {}
        };
      })
    );
  }

  private transformEvolutionData(evolution: any) {
    // Transformer les données d'évolution en format attendu par les graphiques
    return Object.entries(evolution.evolution).map(([mois, stats]: [string, any]) => ({
      mois,
      neuf: stats['Neuf'] || 0,
      enService: stats['Usagé'] || 0,
      enPanne: stats['En panne'] || 0
    }));
  }

  // Méthode pour calculer le taux de panne moyen d'un fournisseur
  calculerTauxPanneMoyen(tauxPannes: number[]): number {
    if (tauxPannes.length === 0) return 0;
    const sum = tauxPannes.reduce((acc, curr) => acc + curr, 0);
    return Math.round((sum / tauxPannes.length) * 100) / 100;
  }

  // Méthode pour formater la date en mois/année
  formatMonth(date: Date): string {
    const options = { month: 'long', year: 'numeric' } as const;
    return new Date(date).toLocaleDateString('fr-FR', options);
  }
}
