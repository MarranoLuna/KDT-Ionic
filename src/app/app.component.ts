import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import {
  IonRouterOutlet,
  IonMenu,
  IonToolbar,
  IonApp,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonButton,
  IonMenuToggle,
  IonAvatar,
  IonFooter
} from '@ionic/angular/standalone';

import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonRouterOutlet,
    IonMenu,
    IonToolbar,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonMenuToggle,
    RouterLink,
    IonAvatar,
    IonButton,
    IonFooter,
  ],
  styleUrls: ['app.component.scss'],
  standalone: true,
})

export class AppComponent {

  private hiddenMenuRoutes = ['/index', '/login', '/register'];

  constructor(private router: Router, private menu: MenuController) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects.split('?')[0];
        if (this.hiddenMenuRoutes.includes(url)) {
          this.menu.enable(false); // deshabilita menú
        } else {
          this.menu.enable(true);  // habilita menú
        }
      }
    });
  }
}
