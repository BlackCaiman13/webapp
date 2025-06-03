import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Status } from '../Models/status.model';
import { APIURL } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  private apiUrl = APIURL + '/api/statuses';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Status[]> {
    return this.http.get<Status[]>(this.apiUrl);
  }

  getById(id: number): Observable<Status> {
    return this.http.get<Status>(`${this.apiUrl}/${id}`);
  }
}
