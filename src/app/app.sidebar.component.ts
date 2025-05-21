import { Component, ElementRef } from '@angular/core';
import { LayoutService } from './Services/app.layout.service';
import { AppMenuComponent } from './app.menu.component';

@Component({
    standalone : true,
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html',
    imports : [AppMenuComponent]
})
export class AppSidebarComponent {
    constructor(public layoutService: LayoutService, public el: ElementRef) { }
}

