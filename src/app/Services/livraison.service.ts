import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Livraison } from '../Models/livraison.model';
import { CreateLivraisonDTO, LivraisonDTO } from '../Dtos/livraison.dto';
import { APIURL } from '../app.config';
import { MaterielDTO } from '../Dtos/materiel.dto';
import { MaterielService } from './materiel.service';

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {
  private apiUrl = APIURL + '/api/livraisons';

  constructor(private http: HttpClient, private materielService: MaterielService) {}

  getAllLivraisons(): Observable<LivraisonDTO[]> {
    return this.http.get<LivraisonDTO[]>(this.apiUrl);
  }

  getLivraisonById(id: number): Observable<LivraisonDTO> {
    return this.http.get<LivraisonDTO>(`${this.apiUrl}/${id}`);
  }

  createLivraison(livraison: LivraisonDTO): Observable<number> {
    return this.http.post<number>(this.apiUrl, livraison);
  }

  createLivraisonAvecMateriels(livraison: LivraisonDTO, materiels: any[]): Observable<any> {
    // À adapter selon l'API backend réelle
    this.createLivraison(livraison).subscribe(id => {
      materiels.forEach(materiel => {
        
        // Conversion explicite en CreateMaterielDTO
        const materielToCreate = {
          nature: materiel.nature,
          model: materiel.model,
          constructeur: materiel.constructeur.id,
          fournisseur: materiel.fournisseur.id,
          type: materiel.type.id,
          status: materiel.statusId,
          employe: materiel.employeeId,
          livraison: id
        };
        this.materielService.create(materielToCreate).subscribe();
      });
    });
    return of(null);
  }

  updateLivraison(id: number, livraison: Partial<Livraison>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, livraison);
  }

  deleteLivraison(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}