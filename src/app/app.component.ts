import { Component } from '@angular/core';
import {  IonRouterOutlet, IonMenu,  IonToolbar, IonApp,
  IonContent, IonList, IonItem,   IonIcon,  IonLabel,  IonButton,
   IonMenuToggle, IonAvatar, IonFooter } from '@ionic/angular/standalone';
  import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [ IonRouterOutlet, IonMenu,  IonToolbar,  IonContent,
    IonList, IonItem,  IonIcon,   IonLabel,   IonMenuToggle,
    RouterLink, IonAvatar, IonButton,    IonFooter],
  styleUrls: ['app.component.scss'],
  standalone: true,
})
export class AppComponent {
  constructor() {}
}