import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanMatchFn } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: OAuthService, private router: Router) {}

  canMatch: CanMatchFn = () => {
    const isAuthenticated = this.authService.hasValidAccessToken();
    if (isAuthenticated) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  };
}