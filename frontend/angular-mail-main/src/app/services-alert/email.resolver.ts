import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Alert } from '../models-alert/alert';
import { AlertService} from "./Alert.service";

@Injectable({
  providedIn: 'root'
})
export class EmailResolver implements Resolve<Alert> {
  constructor(private alertService: AlertService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Alert> {
    const key = route.paramMap.get('id'); // key can be string | null
    if (key === null) {
      throw new Error('Email ID parameter is missing.');
    }
    return this.alertService.getAlertByKey(key);
  }
}
