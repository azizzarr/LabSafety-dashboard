import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alert } from '../models-alert/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private apiUrl = 'http://localhost:8090/api/alerts';

  constructor(private http: HttpClient) {}

  getAllAlerts(): Observable<{ [key: string]: Alert }> {
    return this.http.get<{ [key: string]: Alert }>(`${this.apiUrl}/all`);
  }

  getAlertByKey(key: string): Observable<Alert> {
    console.log(`Fetching alert with key: ${key}`); // Add logging here
    return this.http.get<Alert>(`${this.apiUrl}/${key}`);
  }
}
