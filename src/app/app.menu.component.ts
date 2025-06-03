import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './Services/app.layout.service';
import { CommonModule } from '@angular/common';
import { AppMenuitemComponent } from './app.menuitem.component';
import { Action } from 'rxjs/internal/scheduler/Action';
import { AuthService } from './Services/auth/auth.service';


@Component({
    standalone:true,
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    imports: [CommonModule, AppMenuitemComponent ]
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService, public authService: AuthService) { }

    ngOnInit() {
        if (this.authService.isAdmin()) {
            this.model = [
                {
                    label: 'Home',
                    items: [
                        { label: 'Tableau de board', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
                        { label: 'Livraisons', icon: 'pi pi-fw pi-box', routerLink: ['/livraison'] },
                        { label: 'Materiels', icon: 'pi pi-fw pi-wrench', routerLink: ['/materiels'] },
                        { label: 'Employes', icon: 'pi pi-fw pi-user', routerLink: ['/employes'] },
                        { label: 'Fournisseur', icon: 'pi pi-fw pi-truck', routerLink: ['/fournisseurs'] },
                        
                        
    
                    ]
                },
    
                
            ];
     
        } else if (this.authService.isDirecteur()){
            
            this.model = [
                {
                    label: 'Home',
                    items: [
                        { label: 'Tableau de board', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
                        { label: 'Fournisseur', icon: 'pi pi-fw pi-warehouse', routerLink: ['/fournisseurs'] },
                        
                        
    
                    ]
                },
    
                
            ];
        }else if (this.authService.isExploitation()){
            this.model = [
                {
                    label: 'Home',
                    items: [
                        { label: 'Tableau de board', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
                        { label: 'Livraisons', icon: 'pi pi-fw pi-truck', routerLink: ['/livraison'] },
                        { label: 'Materiels', icon: 'pi pi-fw pi-wrench', routerLink: ['/materiels'] },
                        { label: 'Employes', icon: 'pi pi-fw pi-user', routerLink: ['/employes'] },
                        
                        
    
                    ]
                },
    
                
            ];
        
           
        }


        
    }
}
