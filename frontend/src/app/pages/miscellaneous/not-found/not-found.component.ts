import {NbCalendarRange, NbMenuService} from '@nebular/theme';
import { Component, OnInit } from '@angular/core';
import { WorkersService } from '../../../services/workers.service';
@Component({
  selector: 'ngx-not-found',
  styleUrls: ['./not-found.component.scss'],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent implements OnInit {
  alerts: any[] = [];
  range: NbCalendarRange<Date>;

  constructor(private menuService: NbMenuService, private workersService: WorkersService) {}

  ngOnInit(): void {}

  goToHome() {
    this.menuService.navigateHome();
  }
  redirectToDash1(): void {
    const token = localStorage.getItem('auth_token');
    console.log('tokennn', token); // Get the token from localStorage
    const secondAppUrl = 'http://localhost:65495/email/Alerts';

    // Navigate to the second app in the same window
    window.location.href = `${secondAppUrl}?token=${token}`;
  }

  private storeToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private storeUserId(userId: number): void {
    localStorage.setItem('user_id', userId.toString());
  }
  redirectToFlaskApp() {
    window.location.href = 'http://127.0.0.1:8070/';
  }
}
