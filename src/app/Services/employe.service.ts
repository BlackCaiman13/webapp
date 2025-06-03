import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employe } from '../Models/employe.model';
import { APIURL } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class EmployeService {
  private apiUrl = APIURL + '/api/employes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Employe[]> {
    return this.http.get<Employe[]>(this.apiUrl);
  }
} 