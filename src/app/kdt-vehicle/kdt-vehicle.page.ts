import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,
  IonBackButton,
   } from '@ionic/angular/standalone';

@Component({
  selector: 'app-kdt-vehicle',
  templateUrl: './kdt-vehicle.page.html',
  styleUrls: ['./kdt-vehicle.page.scss'],
  standalone: true,
  imports: [ IonButtons, IonBackButton,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class KdtVehiclePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
