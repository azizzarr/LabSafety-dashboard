import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService} from './auth.services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    console.log('AuthGuard canActivate called');

    if (this.authService.isAuthenticated()) {
      console.log('User is authenticated. Access granted.');
      return true;
    } else {
      console.log('User is not authenticated. Redirecting to login page...');
      this.router.navigate(['/auth/ngx-app-login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
