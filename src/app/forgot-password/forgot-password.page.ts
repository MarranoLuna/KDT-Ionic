import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ForgotPasswordPage implements OnInit {

  constructor(
    private apiService: ApiService,
    private loadingCtrl: LoadingController,
  ) { }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
			spinner: 'crescent'
		});
		await loading.present();
		await this.apiService.verifyLogin().then(() => loading.dismiss());
  }

}
