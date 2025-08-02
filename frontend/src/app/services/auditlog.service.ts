import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

import {AuditLog} from '../models/audit-log.model';
import {Page} from '../models/page.model';

@Injectable({
  providedIn: 'root',
})

export class AuditlogService {
  private logUrl = 'http://localhost:8090';

  constructor(private http: HttpClient) {}

  getAllAuditLogs(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.logUrl}/workers/allLogs`);
  }

  getFilteredAuditLogs(action?: string, startDate?: string,
                       endDate?: string, page?: string, size?: string): Observable<Page<AuditLog>> {
    let params = new HttpParams();
    if (action) params = params.set('action', action);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    params = params.set('page', page.toString());
    params = params.set('size', size.toString());

    return this.http.get<Page<AuditLog>>(`${this.logUrl}/workers/filteredlogs`, { params });
  }


}

