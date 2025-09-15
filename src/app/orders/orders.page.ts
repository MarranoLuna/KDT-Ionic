import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonBackButton,
  IonCardSubtitle, 
  IonCardHeader, 
  IonCard, 
  IonItem, 
  IonList, 
  IonThumbnail, 
  IonToolbar,  
  IonLabel,  
  IonCardContent, 
  IonCardTitle, 
  IonButtons,  
} from '@ionic/angular/standalone';

import { MenuComponent } from '../menu/menu.component';
  //import { RouterLink } from '@angular/router';
  
 


@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle,
    IonCardSubtitle,
    IonCardHeader,
     IonBackButton,
    IonCard, 
    IonItem, 
    IonList, 
    IonToolbar,
    IonThumbnail, 
    CommonModule, 
    FormsModule, 
    IonLabel, 
    IonCardContent, 
    IonCardTitle, 
    IonButtons,  ]
})
export class OrdersPage implements OnInit {
  
  constructor() { }

ngOnInit() {
  }
  

  
}

