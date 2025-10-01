import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonBackButton,
  IonCardSubtitle, 
  IonCardHeader, 
  IonCard, 
  IonItem, 
  IonList, 
  IonThumbnail, 
  IonToolbar,  
  IonLabel,  
  IonCardContent, 
  IonCardTitle, 
  IonButtons, 
  LoadingController 
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
    IonContent, 
    IonHeader, 
    IonTitle,
    IonCardSubtitle,
    IonCardHeader,
     IonBackButton,
    IonCard, 
    IonItem, 
    IonList, 
    IonToolbar,
    IonThumbnail, 
    CommonModule, 
    FormsModule, 
    IonLabel, 
    IonCardContent, 
    IonCardTitle, 
    IonButtons,  ]
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

