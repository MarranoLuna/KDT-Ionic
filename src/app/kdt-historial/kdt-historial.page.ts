import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  
  IonButtons,
  IonBackButton,
  LoadingController
} from '@ionic/angular/standalone';
import { Global } from '../services/global';
@Component({
  selector: 'app-kdt-historial',
  templateUrl: './kdt-historial.page.html',
  styleUrls: ['./kdt-historial.page.scss'],
  standalone: true,
  imports: [IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    CommonModule,
    IonBackButton,
    FormsModule]
})
export class KdtHistorialPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
