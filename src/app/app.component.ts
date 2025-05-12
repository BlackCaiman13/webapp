import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `<router-outlet></router-outlet>`,
  styles: []
})
export class AppComponent implements OnInit {
  constructor(
    private oauthService: OAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Écoute uniquement les événements de connexion réussie
    this.oauthService.events
      .pipe(
        filter(e => e.type === 'token_received')
      )
      .subscribe(() => {
        // Vérifie si nous sommes sur la page d'accueil avant de rediriger
        if (this.router.url === '/' && this.oauthService.hasValidAccessToken()) {
          this.router.navigate(['/home']);
        }
      });
  }
}
