
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { HeaderComponent } from '../header/header.component';
import { AppSidebarComponent } from '../app.sidebar.component';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    AppSidebarComponent,
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
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