import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; 
import { RouterModule } from '@angular/router';
import { 
  LoadingController
} from '@ionic/angular';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-request-sent',
  templateUrl: './request-sent.page.html',
  styleUrls: ['./request-sent.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, 
    RouterModule
  ]
})
export class RequestSentPage implements OnInit {

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


