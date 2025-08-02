import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RedirectionService {

  constructor(private router: Router) { }

  redirectToDash1(): void {
    const token = localStorage.getItem('auth_token');
    console.log('tokennn', token); // Get the token from localStorage
    const secondAppUrl = 'http://localhost:65495/email/Alerts';

    // Navigate to the second app in the same window
    window.location.href = `${secondAppUrl}?token=${token}`;
  }
}
