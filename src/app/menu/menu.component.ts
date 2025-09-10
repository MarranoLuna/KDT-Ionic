import { Component } from '@angular/core';
import {
  IonMenu,
  IonContent,
  IonAvatar,
  IonLabel,
  IonList,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonFooter,
  IonToolbar,
  IonButton
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  standalone: true,
  imports: [
    IonMenu,
    IonContent,
    IonAvatar,
    IonLabel,
    IonList,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonFooter,
    IonToolbar,
    IonButton,
    RouterLink
  ]
})
export class MenuComponent {}
