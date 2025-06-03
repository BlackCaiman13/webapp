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
                        { label: 'Livraisons', icon: 'pi pi-fw pi-check-square', routerLink: ['/livraison'] },
                        { label: 'Materiels', icon: 'pi pi-fw pi-user', routerLink: ['/materiels'] },
                        { label: 'Employes', icon: 'pi pi-fw pi-envelope', routerLink: ['/employes'] },
                        
                        
    
                    ]
                },
    
                
            ];
     
        } else if (this.authService.isDirecteur()){
            
            this.model = [
                {
                    label: 'Home',
                    items: [
                        { label: 'Tableau de board', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
                        { label: 'Permission', icon: 'pi pi-fw pi-check-square', routerLink: ['/livraison'] },
                        { label: 'Calendrier Direction', icon: 'pi pi-fw pi-user', routerLink: ['/calendrierdirection'] },
                        
                        
    
                    ]
                },
    
                
            ];
        }else if (this.authService.isEmploye()){
            this.model = [
                {
                    label: 'Home',
                    items: [
                        { label: 'Tableau de board', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
                        { label: 'Mon Materiel', icon: 'pi pi-fw pi-check-square', routerLink: ['/permission'] },
                        { label: 'Mon Profile', icon: 'pi pi-fw pi-envelope', routerLink: ['/madirection'] },
    
                    ]
                },
    
                
            ];
        }else if (this.authService.isExploitation()){
            this.model = [
                {
                    label: 'Home',
                    items: [
                        { label: 'Tableau de board', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
                        { label: 'Livraison', icon: 'pi pi-fw pi-check-square', routerLink: ['/livraison'] },
                        { label: 'Calendrier Departement', icon: 'pi pi-fw pi-user', routerLink: ['/calendrierdepartement'] },
                        { label: 'Mon Departement', icon: 'pi pi-fw pi-envelope', routerLink: ['/mondepartement'] },
                        
                        
    
                    ]
                },
    
                
            ];
        
           
        }


        
    }
}
