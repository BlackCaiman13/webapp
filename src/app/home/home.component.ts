import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div class="home">
      <h1>Bienvenue dans votre espace E-mat</h1>
      <button pButton type="button" (click)="logout()" label="Se déconnecter"></button>
    </div>
  `,
  styles: [`
    .home {
      padding: 2rem;
      text-align: center;
    }
    h1 {
      margin-bottom: 2rem;
    }
  `]
})
export class HomeComponent implements OnInit {
  constructor(
    private oauthService: OAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.oauthService.hasValidAccessToken()) {
      this.router.navigate(['/']);
    }
  }

  logout() {
    this.oauthService.logOut();
    this.router.navigate(['/']);
  }
}