import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonBackButton,IonList, 
 IonToolbar, IonButtons, LoadingController,IonNote
} from '@ionic/angular/standalone';
import { ApiService } from '../services/api';

import { MenuComponent } from '../menu/menu.component';
import { UserService } from '../services/user';
  //import { RouterLink } from '@angular/router';
  
 


@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle,IonBackButton,IonList, 
    IonToolbar,CommonModule, FormsModule, IonButtons,  IonNote]
})
export class OrdersPage implements OnInit {
  
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

