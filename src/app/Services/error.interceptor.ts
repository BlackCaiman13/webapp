import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.error instanceof ErrorEvent) {
        // Erreur côté client
        return throwError(() => ({
          message: 'Une erreur est survenue, veuillez réessayer.',
          error: error.error
        }));
      } else {
        // Erreur côté serveur
        if (error.status === 409 && error.error?.warning?.key === 'livraison.materiel.livraisons.referenced') {
          return throwError(() => ({
            message: `Impossible de supprimer cette livraison car elle contient le matériel ${error.error.warning.params[0]}`,
            error: error.error
          }));
        }
        return throwError(() => ({
          message: 'Une erreur est survenue côté serveur.',
          error: error.error
        }));
      }
    })
  );
};
