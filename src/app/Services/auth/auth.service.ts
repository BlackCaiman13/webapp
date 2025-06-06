import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserClaims as BaseUserClaims } from '../../Dtos/userclaims';
import { Router } from '@angular/router';
import { LoaderService } from '../loader.service';

interface UserClaims extends BaseUserClaims {
  isAdmin?: boolean;
  isExploitation?: boolean;
  isDirecteur?: boolean;
  isEmploye?: boolean;
  roles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userInfoSubject = new BehaviorSubject<UserClaims | null>(null);
  userInfo$ = this.userInfoSubject.asObservable();

  constructor(
    private oauthService: OAuthService,
    private router: Router,
    private loaderService: LoaderService
  ) {
    this.loadUserInfo();
  }

  private loadUserInfo(): void {
    const accessToken = this.oauthService.getAccessToken();
    let payload: any;

    if (accessToken) {
      const tokenParts = accessToken.split('.');
      if (tokenParts.length === 3) {
        payload = JSON.parse(atob(tokenParts[1]));
      }
    }
    console.log(payload);
    const claims = payload as UserClaims | null;
    if (claims) {
      const userInfo = { 
        ...claims,
        isAdmin: claims.resource_access?.['my-webapp-client']?.roles?.includes('admin') ?? false,
        isExploitation: claims.resource_access?.['my-webapp-client']?.roles?.includes('exploitant') ?? false,
        isDirecteur: claims.resource_access?.['my-webapp-client']?.roles?.includes('directeur') ?? false,
        isEmploye: claims.resource_access?.['my-webapp-client']?.roles?.includes('employe_normal') ?? false,
        roles: [
          ...(claims.realm_access?.roles ?? []),
          ...(claims.resource_access?.['my-webapp-client']?.roles ?? [])
        ]
      };
      this.userInfoSubject.next(userInfo);
    }
  }

  isAuthenticated(): boolean {
   
    return this.oauthService.hasValidAccessToken();
  }

  isAdmin(): boolean {
    const userInfo = this.userInfoSubject.value;
    return userInfo?.isAdmin ?? false;
  }
    isExploitation(): boolean {
        const userInfo = this.userInfoSubject.value;
        return userInfo?.isExploitation ?? false;
    }
    isDirecteur(): boolean {
        const userInfo = this.userInfoSubject.value;
        return userInfo?.isDirecteur ?? false;
    }
    isEmploye(): boolean {
        const userInfo = this.userInfoSubject.value;
        return userInfo?.isEmploye ?? false;
    }

  getUserRoles(): string[] {
    return this.userInfoSubject.value?.roles ?? [];
  }

  getLastRole(): string {
    const roles = this.getUserRoles();
    return roles.length > 0 ? roles[roles.length - 1] : '';
  }

  getUserFullName(): string {
    return this.userInfoSubject.value?.name ?? '';
  }

  getUserEmail(): string {
    return this.userInfoSubject.value?.email ?? '';
  }

  logout(): void {
    this.loaderService.show();
    this.oauthService.logOut();
    this.userInfoSubject.next(null);
    
    // Ajout d'un délai pour montrer le loader
    setTimeout(() => {
      this.router.navigate(['/']);
      this.loaderService.hide();
    }, 1000);
  }

  refreshUserInfo(): void {
    this.loadUserInfo();
  }
}