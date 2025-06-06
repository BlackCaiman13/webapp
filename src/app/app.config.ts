import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthConfig, OAuthService, provideOAuthClient } from 'angular-oauth2-oidc';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './Services/auth/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { LoaderInterceptor } from './Services/loader.interceptor';
import { MessageService } from 'primeng/api';
import { ErrorService } from './core/services/error.service';


export const authCodeFlowConfig: AuthConfig = {
  issuer: 'http://localhost:8180/realms/E-mat',
  tokenEndpoint: 'http://localhost:8180/realms/E-mat/protocol/openid-connect/token',
  redirectUri: window.location.origin,
  clientId: 'my-webapp-client',
  responseType: 'code',
  scope: 'openid profile',
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false
};

export const APIURL = 'http://localhost:8080';

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
    provideHttpClient(withInterceptors([AuthInterceptor, ErrorInterceptor, LoaderInterceptor])),
    provideOAuthClient(),
    provideAnimations(),
    MessageService,
    ErrorService,
    {
      provide: APP_INITIALIZER,
      useFactory: (oauthService: OAuthService) => {
        return () => initializeOAuth(oauthService);
      },
      multi: true,
      deps: [OAuthService]
    }
  ]
};

