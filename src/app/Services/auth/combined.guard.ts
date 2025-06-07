import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CombinedGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    const allowedRoles = route.data['roles'] as string[];

    if (!isAuthenticated) {
      this.router.navigate(['/']);
      return false;
    }

    const hasRole = allowedRoles.some(role => {
      switch (role) {
        case 'admin':
          return this.authService.isAdmin();
        case 'exploitant':
          return this.authService.isExploitation();
        case 'directeur':
          return this.authService.isDirecteur();
        default:
          return false;
      }
    });

    if (hasRole) {
      return true;
    } else {
      this.router.navigate(['/access-deny']);
      return false;
    }
  }
}
