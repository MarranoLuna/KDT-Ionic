import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonNote,
  IonList,
  IonButtons,
  IonBackButton,
  LoadingController
} from '@ionic/angular/standalone';
import { Global } from '../services/global';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonNote,
    IonList,
    IonButtons,
    CommonModule,
    IonBackButton,
    FormsModule]
})
export class NotificationsPage implements OnInit {

  constructor(
    private global: Global,
    private loadingCtrl: LoadingController,
  ) { }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent'
    });
    await loading.present();
    await this.global.verifyLogin().then(() => loading.dismiss());
  }
}
