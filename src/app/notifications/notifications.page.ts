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
import { UserService } from '../services/user';

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
    private userService: UserService,
    private loadingCtrl: LoadingController,
  ) { }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent'
    });
    await loading.present();
    await this.userService.verifyLogin().then(() => loading.dismiss());
  }
}
