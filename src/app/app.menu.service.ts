import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { MenuItem } from './interfaces/menu.interface';


export interface MenuChangeEvent {
    key: string;
    routeEvent?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private menuItems: MenuItem[] = [
        {
            label: 'Accueil',
            icon: 'pi pi-home',
            routerLink: ['/']
        },
        {
            label: 'Gestion',
            icon: 'pi pi-cog',
            items: [
                {
                    label: 'Utilisateurs',
                    icon: 'pi pi-users',
                    routerLink: ['/users']
                },
                {
                    label: 'Produits',
                    icon: 'pi pi-box',
                    routerLink: ['/products']
                }
            ]
        }
        // Ajoutez d'autres éléments de menu selon vos besoins
    ];

    private menuSource = new Subject<MenuChangeEvent>();
    private resetSource = new Subject<void>();
    private menuItemsSource = new BehaviorSubject<MenuItem[]>(this.menuItems);

    menuSource$ = this.menuSource.asObservable();
    resetSource$ = this.resetSource.asObservable();
    menuItems$ = this.menuItemsSource.asObservable();

    onMenuStateChange(event: MenuChangeEvent) {
        this.menuSource.next(event);
    }

    reset() {
        this.resetSource.next();
    }

    getMenuItems(): MenuItem[] {
        return this.menuItems;
    }

    updateMenuItem(item: MenuItem) {
        // Logique pour mettre à jour un élément du menu
        const updatedItems = [...this.menuItems];
        // Implémentez votre logique de mise à jour ici
        this.menuItemsSource.next(updatedItems);
    }
}
