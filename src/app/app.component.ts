import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: []
})
export class AppComponent implements OnInit {
  constructor(
    private oauthService: OAuthService,
    private router: Router,
    private primengConfig: PrimeNGConfig
  ) {}
 

   
        

  ngOnInit() {

    this.primengConfig.ripple = true
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
