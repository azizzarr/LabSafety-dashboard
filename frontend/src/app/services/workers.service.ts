import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Worker} from '../models/worker.model';
import { Poste } from '../models/Poste.model';

import {ServiceWork} from '../models/ServiceWork.model';
import { AuditLog } from '../models/audit-log.model';
@Injectable({
  providedIn: 'root',
})

export class WorkersService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:8090';
  private postesUrl = 'http://localhost:8090/workers/getPoste';
  private dashUrl = 'http://127.0.0.1:8070/';
  getAllWorkers(): Observable<Worker[]> {
    return this.http.get<Worker[]>(`${this.apiUrl}/workers/all`);
  }
  getWorkersWithTodayDate(): Observable<Worker[]> {
    return this.http.get<Worker[]>(`${this.apiUrl}/workers/today`);
  }
  addWorker(worker: Worker): Observable<Worker> {
    const url = `${this.apiUrl}/workers/add`;
    return this.http.post<Worker>(url, worker);
  }
  getPostes(): Observable<Poste[]> {
    return this.http.get<Poste[]>(this.postesUrl);
  }
  getService(): Observable<ServiceWork[]> {
    return this.http.get<ServiceWork[]>(`${this.apiUrl}/workers/getService`);
  }
  countWorkersWithChargeEsdOver80(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/workers/count-workers-charge-esd-over-80`);
  }

  countWorkersWithChargeEsdBetween40And80(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/workers/count-workers-charge-esd-between-40-and-80`);
  }

  countWorkersWithChargeEsdUnder40(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/workers/count-workers-charge-esd-under-40`);
  }
  countAllWorkers(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/workers/count-all-workers`);
  }
  getWorkersByPosteCMS1(): Observable<Worker[]> {
    return this.http.get<Worker[]>(`${this.apiUrl}/workers/poste/CMS1`);
  }
  getWorkersByPosteCMS2(): Observable<Worker[]> {
    return this.http.get<Worker[]>(`${this.apiUrl}/workers/poste/CMS2`);
  }
  getWorkersByPosteIntegration(): Observable<Worker[]> {
    return this.http.get<Worker[]>(`${this.apiUrl}/workers/poste/Integration`);
  }
  getWorkersByTodayDateAndPoste(posteName: string): Observable<Worker[]> {
    return this.http.get<Worker[]>(`${this.apiUrl}/workers/todayPoste/${posteName}`);
  }
  countLastWeekWorkers(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${this.apiUrl}/workers/countLastWeekWorkers`);
  }
  getWorkersAndAverageChargeEsdByDayInLastWeek(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/workers/stats/last-week`);
  }
  countWorkersByPostNames(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${this.apiUrl}/workers/count_by_postes`);
  }
  getTop10WorkersByChargeEsd(): Observable<Worker[]> {
    return this.http.get<Worker[]>(`${this.apiUrl}/workers/top10ByChargeEsd`);
  }
  getWorkersByDate(date: string): Observable<Worker[]> {
    return this.http.get<Worker[]>(`${this.apiUrl}/workers/by-date/${date}`);
  }
  getStatisticsForLastWeek(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/workers/statistics/forlastweek_average`);
  }
  addPoste(poste: Poste): Observable<Poste> {
    const url = `${this.apiUrl}/workers/addPoste`;
    return this.http.post<Poste>(url, poste);
  }
  getWorkersByExactDateTime(dateTime: string): Observable<Worker[]> {
    return this.http.get<Worker[]>(`${this.apiUrl}/workers/byDateTime/${dateTime}`);
  }
  getWorkersByMatricule(matricule: string): Observable<Worker[]> {
    return this.http.get<Worker[]>(`${this.apiUrl}/workers/matricule/${matricule}`);
  }
  getWorkersByLast7Days(): Observable<Worker[]> {
    return this.http.get<Worker[]>(`${this.apiUrl}/workers/last7days`);
  }

  getWorkersByLast7DaysAndPoste(posteName: string): Observable<Worker[]> {
    return this.http.get<Worker[]>(`${this.apiUrl}/workers/last7days/${posteName}`);
  }
  getAverageChargeEsdByMatricule(matricule: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/workers/average-charge/${matricule}`);
  }
  redirectToDash(): Observable<void> {
    return this.http.get<void>(this.dashUrl);
  }

  getUsernameFromToken(token: string): Observable<string> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/workers/usernamee`, { headers, responseType: 'text' });
  }
  getAllAuditLogs(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.apiUrl}/workers/allLogs`);
  }
}
