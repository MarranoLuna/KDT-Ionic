import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonCardSubtitle, IonCardHeader, IonCard, IonItem, IonList, IonThumbnail, IonToolbar, IonApp, IonGrid, IonLabel, IonIcon, IonCardContent, 
  IonCardTitle, IonMenuButton, IonButton, IonButtons, IonRow, } from '@ionic/angular/standalone';
  import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle,IonCardSubtitle,IonCardHeader,IonCard, IonItem, IonList, IonToolbar,IonThumbnail, CommonModule, FormsModule,  IonApp, IonGrid, IonLabel, 
    IonIcon, IonCardContent, IonCardTitle, IonMenuButton, IonButton, IonButtons, IonRow,  RouterLink]
})
export class OrdersPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
