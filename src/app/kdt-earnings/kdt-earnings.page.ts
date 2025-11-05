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
  selector: 'app-kdt-earnings',
  templateUrl: './kdt-earnings.page.html',
  styleUrls: ['./kdt-earnings.page.scss'],
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
export class KdtEarningsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
