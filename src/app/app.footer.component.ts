import { Component } from '@angular/core';
import { LayoutService } from './Services/app.layout.service';


@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html',
    standalone: true
})
export class AppFooterComponent {
    constructor(public layoutService: LayoutService) { }
}
