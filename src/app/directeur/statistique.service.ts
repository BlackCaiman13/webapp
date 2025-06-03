import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { APIURL } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class StatistiqueService {
  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return forkJoin({
      materiels: this.http.get<any[]>(`${APIURL}/api/materiels`),
      fournisseurs: this.http.get<any[]>(`${APIURL}/api/fournisseurs`),
      livraisons: this.http.get<any[]>(`${APIURL}/api/livraisons`)
    }).pipe(
      map(({ materiels, fournisseurs, livraisons }) => {
        // Exemple de données pour les graphiques
        return {
          pie: {
            labels: ['Matériels', 'Fournisseurs', 'Livraisons'],
            datasets: [{ data: [materiels.length, fournisseurs.length, livraisons.length] }]
          },
          bar: {
            labels: ['Matériels', 'Fournisseurs', 'Livraisons'],
            datasets: [{ label: 'Total', data: [materiels.length, fournisseurs.length, livraisons.length] }]
          }
        };
      })
    );
  }
} 