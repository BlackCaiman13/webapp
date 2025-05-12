import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [MenubarModule, ButtonModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  menuItems: MenuItem[] = [
    {
      label: 'Accueil',
      icon: 'pi pi-home'
    },
    {
      label: 'Services',
      icon: 'pi pi-cog',
      items: [
        {
          label: 'Gestion des matériels',
          icon: 'pi pi-desktop'
        },
        {
          label: 'Suivi des employés',
          icon: 'pi pi-users'
        },
        {
          label: 'Gestion des fournisseurs',
          icon: 'pi pi-truck'
        }
      ]
    },
    {
      label: 'À propos',
      icon: 'pi pi-info-circle'
    },
    {
      label: 'Contact',
      icon: 'pi pi-envelope'
    }
  ];

  constructor(
    private oauthService: OAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Si l'utilisateur est déjà authentifié, le rediriger vers /home
    if (this.oauthService.hasValidAccessToken()) {
      this.router.navigate(['/home']);
    }
  }

  login() {
    this.oauthService.initLoginFlow();
  }
}