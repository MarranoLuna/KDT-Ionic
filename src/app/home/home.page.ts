import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonAvatar,
  IonContent, IonGrid, IonRow,  IonCol, IonCard, IonCardContent, IonCardHeader, IonCardTitle
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonAvatar,
    IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent,
    RouterLink, IonCardContent, IonCardHeader, IonCardTitle, IonGrid
  ]
})
export class HomePage {}