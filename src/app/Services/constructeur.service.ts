
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConstructeurDTO, CreateConstructeurDTO, UpdateConstructeurDTO } from '../Dtos/constructeur.dto';
import { Constructeur } from '../Models/constructeur.model';
import { APIURL } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class ConstructeurService {
  private apiUrl = APIURL + '/api/constructeurs';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Constructeur[]> {
    return this.http.get<ConstructeurDTO[]>(this.apiUrl).pipe(
      map(dtos => dtos.map(dto => this.mapToModel(dto)))
    );
  }

  getById(id: number): Observable<Constructeur> {
    return this.http.get<ConstructeurDTO>(`${this.apiUrl}/${id}`).pipe(
      map(dto => this.mapToModel(dto))
    );
  }

  create(constructeur: CreateConstructeurDTO): Observable<number> {
    return this.http.post<number>(this.apiUrl, constructeur);
  }

  update(id: number, constructeur: UpdateConstructeurDTO): Observable<number> {
    return this.http.put<number>(`${this.apiUrl}/${id}`, constructeur);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private mapToModel(dto: ConstructeurDTO): Constructeur {
    return {
      id: dto.id,
      nomConstructeur: dto.nomConstructeur,
      codeConstructeur: dto.codeConstructeur,
      etat: dto.etatId,
      materiels: dto.materielsIds,
      dateCreated: dto.dateCreated,
      lastUpdated: dto.lastUpdated
    };
  }
}