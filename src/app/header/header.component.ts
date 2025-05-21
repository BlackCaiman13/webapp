import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  currentUser: any;

  constructor(private authService: OAuthService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentuser') || '{}');
    console.log(this.currentUser);
  }

  logout() {
    this.authService.logOut();
  }

}
