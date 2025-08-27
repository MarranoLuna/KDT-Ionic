import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonGrid, IonRow, IonIcon, IonCol,IonCardContent, IonLabel, IonButtons, IonButton,
  IonMenuButton, IonMenuToggle, IonAvatar,IonCardHeader,IonCardTitle, IonFooter } from '@ionic/angular/standalone';
  import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonGrid, IonIcon, IonRow, IonCol, IonLabel, IonButtons, IonMenuButton, IonMenuToggle,
    RouterLink, IonAvatar, IonButton, IonCardContent, IonCardHeader, IonCardTitle, IonFooter],
  styleUrls: ['app.component.scss'],
  standalone: true,
})
export class AppComponent {
  constructor() {}
}