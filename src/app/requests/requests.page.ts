import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBadge, IonList, 
  IonMenuButton, IonBackButton,IonLabel, IonIcon, IonItem, IonButtons, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/angular/standalone';
  //import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
  standalone: true,
  imports: [FormsModule, IonBackButton, IonContent, IonHeader,IonBadge, IonList, IonTitle, IonToolbar, CommonModule,  IonMenuButton,  IonButtons, 
    IonButton, IonCard, IonCardHeader, IonLabel, IonIcon, IonItem,IonCardTitle, IonCardSubtitle, IonCardContent 
   ]
})
export class RequestsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
