import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { PrimeNGConfig } from 'primeng/api';
import { LoaderComponent } from './shared/loader/loader.component';
import { Subject } from 'rxjs';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule, 
    RouterOutlet, 
    LoaderComponent,
    ToastModule
  ],
  template: `
    <p-toast></p-toast>
    <app-loader></app-loader>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private oauthService: OAuthService,
    private router: Router,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.setupOAuthListener();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupOAuthListener(): void {
    this.oauthService.events.pipe(
      filter(e => e.type === 'token_received'),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.handleSuccessfulLogin();
    });
  }

  private handleSuccessfulLogin(): void {
    if (this.router.url === '/' && this.oauthService.hasValidAccessToken()) {
      this.router.navigate(['/home']);
    }
  }
}
