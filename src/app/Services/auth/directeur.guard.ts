import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanMatchFn } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DirecteurGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canMatch: CanMatchFn = () => {
    const isAuthenticated = this.authService.isAuthenticated();
    const isDirecteur = this.authService.isDirecteur();

    if (isAuthenticated && isDirecteur) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  };
}