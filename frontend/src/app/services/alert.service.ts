// src/app/services/alert.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alert } from '../models/alert.model';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private baseUrl = 'http://localhost:8090/api/alerts';

  constructor(private http: HttpClient) { }

  getAllAlertsFromDatabase(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.baseUrl}/databaseAlerts`);
  }
  validateAlert(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/validate/${id}`, {});
  }
  getAlertsForToday(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.baseUrl}/today`);
  }

  getAlertsForLastWeek(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.baseUrl}/last-week`);
  }

  getAlertsForLastMonth(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.baseUrl}/last-month`);
  }
}
