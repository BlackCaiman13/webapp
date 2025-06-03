import { inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Injection correcte du service
  const oauthService = inject(OAuthService);
  const accessToken = oauthService.getAccessToken();

  // Ajout du header Authorization si le token existe
  const modifiedReq = req.clone({
    headers: req.headers.set('Authorization', accessToken ? `Bearer ${accessToken}` : '')
  });

  return next(modifiedReq);
};