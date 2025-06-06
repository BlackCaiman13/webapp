import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../Services/loader.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  template: `
    <div *ngIf="loaderService.isLoading$ | async" class="loader-overlay">
      <div class="loader-content">
        <p-progressSpinner 
          styleClass="custom-spinner" 
          strokeWidth="4" 
          animationDuration=".7s">
        </p-progressSpinner>
        <div class="loading-text">
          Chargement...
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loader-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      backdrop-filter: blur(2px);
    }
    
    .loader-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    
    :host ::ng-deep .custom-spinner {
      width: 5rem !important;
      height: 5rem !important;
    }

    :host ::ng-deep .custom-spinner .p-progress-spinner-circle {
      stroke:#6366F1 !important;
      stroke-width: 4;
      animation-duration: 0.7s;
    }
    
    .loading-text {
      color: white;
      font-size: 1.2rem;
      font-weight: 500;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0% {
        opacity: 0.6;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0.6;
      }
    }
  `]
})
export class LoaderComponent {
  constructor(public loaderService: LoaderService) {}
}
