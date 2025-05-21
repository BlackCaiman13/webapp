import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthConfig, OAuthService, provideOAuthClient } from 'angular-oauth2-oidc';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

export const authCodeFlowConfig: AuthConfig = {
  issuer: 'http://localhost:8180/realms/my-test-realm',
  tokenEndpoint: 'http://localhost:8180/realms/my-test-realm/protocol/openid-connect/token',
  redirectUri: window.location.origin,
  clientId: 'my-webapp-client',
  responseType: 'code',
  scope: 'openid profile',
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false
};

function initializeOAuth(oauthService: OAuthService): Promise<void> {
  return new Promise((resolve) => {
    oauthService.configure(authCodeFlowConfig);
    oauthService.setupAutomaticSilentRefresh();
    
    // Gère le flux de retour OAuth si présent
    oauthService.loadDiscoveryDocument().then(() => {
      oauthService.tryLoginCodeFlow().then(() => {
        resolve();
      });
    });
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideOAuthClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: (oauthService: OAuthService) => {
        return () => initializeOAuth(oauthService);
      },
      multi: true,
      deps: [OAuthService]
    },
    provideAnimations()
  ]
};
