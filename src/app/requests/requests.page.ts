import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonApp, IonGrid, IonLabel, IonIcon, IonCardContent, 
  IonCardTitle, IonMenuButton, IonButton, IonButtons, IonRow, } from '@ionic/angular/standalone';
  import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,  IonApp, IonGrid, IonLabel, 
    IonIcon, IonCardContent, IonCardTitle, IonMenuButton, IonButton, IonButtons, IonRow,  RouterLink]
})
export class RequestsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
