import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

export function authGuard() {
  const oauthService = inject(OAuthService);
  const router = inject(Router);

  if (!oauthService.hasValidAccessToken()) {
    // Enregistre l'URL cible pour la redirection après connexion
    oauthService.initLoginFlow();
    return false;
  }
  return true;
}
