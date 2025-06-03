import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MaterielDTO, CreateMaterielDTO, UpdateMaterielDTO } from '../Dtos/materiel.dto';
import { Materiel } from '../Models/materiel.model';
import { APIURL } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class MaterielService {
  private apiUrl = APIURL + '/api/materiels';

  constructor(private http: HttpClient) {}

  getAll(): Observable<MaterielDTO[]> {
    return this.http.get<MaterielDTO[]>(this.apiUrl);
  }

  getById(id: number): Observable<MaterielDTO> {
    return this.http.get<MaterielDTO>(`${this.apiUrl}/${id}`);
  }

  create(materiel: CreateMaterielDTO): Observable<number> {
    return this.http.post<number>(this.apiUrl, materiel);
  }

  update(id: number, materiel: UpdateMaterielDTO): Observable<number> {
    return this.http.put<number>(`${this.apiUrl}/${id}`, materiel);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getMaterielsAttribuesDirecteur(): Observable<MaterielDTO[]> {
    // À remplacer par un vrai appel backend filtré par l'utilisateur connecté
    return this.http.get<MaterielDTO[]>(this.apiUrl);
  }

  getMaterielsEnStock(): Observable<MaterielDTO[]> {
    // À remplacer par un vrai appel backend filtré par l'état 'en stock'
    return this.getAll();
  }

  attribuerMateriel(materielId: number, employeId: number): Observable<any> {
    console.log(`Attribution du matériel ${materielId} à l'employé ${employeId}`);
    // À adapter selon l'API backend réelle
    return this.http.put(`${this.apiUrl}/${materielId}/attribuer`, { employeId });
  }

    getMaterielsAttribues(): Observable<MaterielDTO[]> {
    // À remplacer par un vrai appel backend filtré par les matériels attribués
    return this.getAll();
  }

  revoquerAttribution(materielId: number): Observable<any> {
    // À adapter selon l'API backend réelle
    return this.http.put(`${this.apiUrl}/${materielId}/revoquer`, {});
  }

  changerEtat(materielId: number, etatId: number): Observable<any> {
    // À adapter selon l'API backend réelle
    return this.http.put(`${this.apiUrl}/${materielId}/changer-etat`, { etatId });
  }

  private mapToModel(dto: MaterielDTO): Materiel {
    return {
      id: dto.id ?? 0,
      nature: dto.nature,
      model: dto.model,
      constructeur: dto.constructeur ?? 0,
      fournisseur: dto.fournisseur ?? 0,
      type: dto.type,
      status: dto.status,
    };
  }
}
