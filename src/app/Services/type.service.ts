import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Type } from '../Models/type.model';
import { TypeDto } from '../Dtos/type.dto';
import { APIURL } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class TypeService {
  private apiUrl = APIURL + '/api/types'; // Ajustez l'URL selon votre backend

  constructor(private http: HttpClient) {}

  getAll(): Observable<TypeDto[]> {
    console.log(this.http.get<TypeDto[]>(this.apiUrl));
    return this.http.get<TypeDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<Type> {
    return this.http.get<Type>(`${this.apiUrl}/${id}`);
  }

  create(type: Omit<Type, 'id' | 'dateCreated' | 'lastUpdated'>): Observable<Type> {
    return this.http.post<Type>(this.apiUrl, type);
  }

  update(id: number, type: Partial<Omit<Type, 'id' | 'dateCreated' | 'lastUpdated'>>): Observable<Type> {
    return this.http.put<Type>(`${this.apiUrl}/${id}`, type);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Méthode utilitaire pour récupérer les types utilisés par un matériel
  getTypesByMaterielId(materielId: number): Observable<Type[]> {
    return this.http.get<Type[]>(`${this.apiUrl}/materiel/${materielId}`);
  }
}