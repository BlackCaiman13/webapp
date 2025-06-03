import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FournisseurDTO, CreateFournisseurDTO, UpdateFournisseurDTO } from '../Dtos/fournisseur.dto';
import { Fournisseur } from '../Models/fournisseur.model';
import { APIURL } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  private apiUrl = APIURL + '/api/fournisseurs';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Fournisseur[]> {
    return this.http.get<FournisseurDTO[]>(this.apiUrl).pipe(
      map(dtos => dtos.map(dto => this.mapToModel(dto)))
    );
  }

  getById(id: number): Observable<Fournisseur> {
    return this.http.get<FournisseurDTO>(`${this.apiUrl}/${id}`).pipe(
      map(dto => this.mapToModel(dto))
    );
  }

  create(fournisseur: CreateFournisseurDTO): Observable<number> {
    return this.http.post<number>(this.apiUrl, fournisseur);
  }

  update(id: number, fournisseur: UpdateFournisseurDTO): Observable<number> {
    return this.http.put<number>(`${this.apiUrl}/${id}`, fournisseur);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getFournisseursAvecRendement(): Observable<Fournisseur[]> {
    // Ici, on suppose que le backend retourne déjà le rendement, sinon il faut le calculer côté front
    return this.http.get<Fournisseur[]>(this.apiUrl).pipe(
      map(fournisseurs => fournisseurs.map(f => ({ ...f, rendement: Math.floor(Math.random() * 100) }))) // MOCK rendement
    );
  }

  private mapToModel(dto: FournisseurDTO): Fournisseur {
    return {
      id: dto.id,
      nomFournisseur: dto.nomFournisseur,
      codeFournisseur: dto.codeFournisseur,
      etat: dto.etatId,
      materiels: dto.materielsIds,
      livraisons: dto.livraisonsIds,
      dateCreated: dto.dateCreated,
      lastUpdated: dto.lastUpdated
    };
  }
}
