import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './Services/app.layout.service';
import { CommonModule } from '@angular/common';
import { AppMenuitemComponent } from './app.menuitem.component';
import { Action } from 'rxjs/internal/scheduler/Action';
import { OAuthService } from 'angular-oauth2-oidc';


@Component({
    standalone:true,
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    imports: [CommonModule, AppMenuitemComponent ]
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService, public authService: OAuthService) { }

    ngOnInit() {
        if (this.authService.getGrantedScopes()) {
            console.log(this.authService.getGrantedScopes());
            this.model = [
                {
                    label: 'Home',
                    items: [
                        { label: 'Tableau de board', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
                        { label: 'Permission', icon: 'pi pi-fw pi-check-square', routerLink: ['/permission'] },
                        { label: 'Calendrier Direction', icon: 'pi pi-fw pi-user', routerLink: ['/calendrierdirection'] },
                        { label: 'Ma Direction', icon: 'pi pi-fw pi-envelope', routerLink: ['/madirection'] },
                        { label: 'Utilisateurs', icon: 'pi pi-fw pi-envelope', routerLink: ['/utilisateurs'] },
                        { label: 'Super Admin Board', icon: 'pi pi-fw pi-envelope', routerLink: ['/adminboars'] },
                        { label: 'Changer de Profil', icon: 'pi pi-fw pi-envelope', routerLink: ['/role-selection'] },
                        
    
                    ]
                },
    
                
            ];
     
        } else if (this.authService.getGrantedScopes()){
            
            this.model = [
                {
                    label: 'Home',
                    items: [
                        { label: 'Tableau de board', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
                        { label: 'Permission', icon: 'pi pi-fw pi-check-square', routerLink: ['/permission'] },
                        { label: 'Calendrier Direction', icon: 'pi pi-fw pi-user', routerLink: ['/calendrierdirection'] },
                        { label: 'Ma Direction', icon: 'pi pi-fw pi-envelope', routerLink: ['/madirection'] },
                        { label: 'Utilisateurs', icon: 'pi pi-fw pi-envelope', routerLink: ['/utilisateurs'] },
                        { label: 'Changer de Profil', icon: 'pi pi-fw pi-envelope', routerLink: ['/role-selection'] },
                        
    
                    ]
                },
    
                
            ];
        // }else if (this.authService.isRole('ROLE_Directeur')){
        //     this.model = [
        //         {
        //             label: 'Home',
        //             items: [
        //                 { label: 'Tableau de board', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
        //                 { label: 'Permission', icon: 'pi pi-fw pi-check-square', routerLink: ['/permission'] },
        //                 { label: 'Calendrier Direction', icon: 'pi pi-fw pi-user', routerLink: ['/calendrierdirection'] },
        //                 { label: 'Ma Direction', icon: 'pi pi-fw pi-envelope', routerLink: ['/madirection'] },
        //                 { label: 'Changer de Profil', icon: 'pi pi-fw pi-envelope', routerLink: ['/role-selection'] },
                        
    
        //             ]
        //         },
    
                
        //     ];
        // }else if (this.authService.isRole('ROLE_Chef de departement')){
        //     this.model = [
        //         {
        //             label: 'Home',
        //             items: [
        //                 { label: 'Tableau de board', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
        //                 { label: 'Permission', icon: 'pi pi-fw pi-check-square', routerLink: ['/permission'] },
        //                 { label: 'Calendrier Departement', icon: 'pi pi-fw pi-user', routerLink: ['/calendrierdepartement'] },
        //                 { label: 'Mon Departement', icon: 'pi pi-fw pi-envelope', routerLink: ['/mondepartement'] },
        //                 { label: 'Changer de Profil', icon: 'pi pi-fw pi-envelope', routerLink: ['/role-selection'] },
                        
    
        //             ]
        //         },
    
                
        //     ];
        // }else if (this.authService.isRole('ROLE_Directeur des ressources humaines')){
        //     this.model = [
        //         {
        //             label: 'Home',
        //             items: [
        //                 { label: 'Tableau de board', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
        //                 { label: 'Permission', icon: 'pi pi-fw pi-check-square', routerLink: ['/permission'] },
        //                 { label: 'Profile', icon: 'pi pi-fw pi-user', routerLink: ['/profile'] },
        //                 { label: 'Demandes', icon: 'pi pi-fw pi-envelope', routerLink: ['/demandes'] },
        //                 { label: 'Changer de Profil', icon: 'pi pi-fw pi-envelope', routerLink: ['/role-selection'] },
                        
    
        //             ]
        //         },
    
                
        //     ];
        // }else if(this.authService.isRole('ROLE_standard1')) {
        //     this.model = [
        //         {
        //             label: 'Home',
        //             items: [
        //                 { label: 'Tableau de board', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
        //                 { label: 'Permission', icon: 'pi pi-fw pi-check-square', routerLink: ['/permission'] },
        //                 { label: 'Profile', icon: 'pi pi-fw pi-user', routerLink: ['/profile'] },
        //                 { label: 'Notifications', icon: 'pi pi-fw pi-envelope', routerLink: ['/notifications'] },
        //                 { label: 'Changer de Profil', icon: 'pi pi-fw pi-envelope', routerLink: ['/role-selection'] },
    
        //             ]
        //         },
    
                
        //     ];
           
        }


        
    }
}
