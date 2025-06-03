import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Etat } from '../Models/etat.model';
import { APIURL } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class EtatService {
  private apiUrl = APIURL + '/api/etats';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Etat[]> {
    return this.http.get<Etat[]>(this.apiUrl);
  }
} 