import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonLabel,IonAvatar,
  IonContent, IonGrid, IonRow, IonIcon, IonCol, IonCard, IonCardContent, IonCardHeader, IonCardTitle
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonAvatar,
    IonContent, IonGrid, IonRow, IonCol, IonIcon, IonCard, IonCardContent,
    RouterLink, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonLabel
  ]
})
export class HomePage {}