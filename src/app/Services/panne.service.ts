import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIURL } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class PanneService {
  constructor(private http: HttpClient) {}

  signalerPanne(materielId: number, description: string): Observable<any> {
    // À adapter selon l'API backend réelle
    return this.http.post(`${APIURL}/api/materiels/${materielId}/pannes`, { description });
  }
} 