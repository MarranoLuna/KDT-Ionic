import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user';
import { OnInit } from '@angular/core';
import {

	IonHeader,
	IonToolbar,
	IonTitle,
	IonButtons,
	IonMenuButton,
	IonAvatar,
	IonContent,
	IonGrid,
	IonRow,
	IonCol,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle
} from '@ionic/angular/standalone';

import { RouterLink } from '@angular/router';

import { MenuComponent } from '../menu/menu.component';
import { ApiService } from '../services/api';

import { LoadingController } from '@ionic/angular';

@Component({
	selector: 'app-home',
	templateUrl: './home.page.html',
	styleUrls: ['./home.page.scss'],
	standalone: true,
	imports: [
	  IonHeader, 
     IonToolbar, 
     IonTitle, 
     IonButtons, 
     IonMenuButton, 
     IonAvatar,
		IonContent, 
           IonGrid, 
           IonRow, 
           IonCol, 
           IonCard, 
           IonCardContent,
    RouterLink, 
           IonCardContent, 
           IonCardHeader, 
           IonCardTitle, 
           IonGrid, 
           MenuComponent
	]

})

export class HomePage implements OnInit {

	userName: string = '';

	constructor(
		private userService: UserService,
		private apiService: ApiService,
		private loadingCtrl: LoadingController,
	) {
	}

	async ngOnInit() {
		const loading = await this.loadingCtrl.create({
			spinner: 'crescent'
		});
		await loading.present();
		await this.apiService.verifyLogin().then(() => loading.dismiss());
		this.userName = this.userService.getCurrentUserName();
	}

}