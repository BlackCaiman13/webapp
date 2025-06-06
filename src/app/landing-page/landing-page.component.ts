import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
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
export class LandingPageComponent implements OnInit, OnDestroy {
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

  isScrolled = false;
  isMobileMenuOpen = false;
  private scrollListener: any;

  constructor(
    private router: Router,
    private oauthService: OAuthService
  ) {
    this.scrollListener = this.onScroll.bind(this);
  }

  ngOnInit() {
    window.addEventListener('scroll', this.scrollListener);
    document.body.classList.add('smooth-scroll');

    // Si l'utilisateur est déjà authentifié, le rediriger vers /home
    if (this.oauthService.hasValidAccessToken()) {
      this.router.navigate(['/home']);
    }
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollListener);
    document.body.classList.remove('smooth-scroll');
  }

  @HostListener('window:scroll', [])
  onScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
  }

  scrollToSection(sectionId: string, isMobile: boolean = false) {
    if (isMobile) {
      this.toggleMobileMenu();
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  login() {
    this.oauthService.initLoginFlow();
  }
}