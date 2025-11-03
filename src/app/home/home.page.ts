import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user';
import { Global } from 'src/app/services/global';
import { OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { ApiService } from '../services/api';
import { Preferences } from '@capacitor/preferences';
import { LoadingController } from '@ionic/angular';

@Component({
	selector: 'app-home',
	templateUrl: './home.page.html',
	styleUrls: ['./home.page.scss'],
	standalone: true,
	imports: [ RouterLink, MenuComponent, IonicModule]})

export class HomePage implements OnInit {

	userName: string = '';

	constructor(
		private userService: UserService, 
    private global: Global,
		private apiService: ApiService,
		private loadingCtrl: LoadingController,
	) {
    	this.mostrarUSer();
	}

	async ngOnInit() {
    const loading = await this.loadingCtrl.create({ spinner: 'crescent' });
    await loading.present();

    try {
        await this.global.verifyLogin();

       
        const currentUser = await this.userService.getCurrentUser();

        if (currentUser) {
            this.userName = currentUser.firstname; 
        }else{
          this.userName = 'Invitado'; 
        }

    } catch (error) {
        console.error('Ocurrió un error:', error);
    } finally {
        await loading.dismiss();
    }
}

	private async mostrarUSer(){
    const { value } = await Preferences.get({ key: 'user' });
    if (value) {
      console.log('User data:', JSON.parse(value));
    } else {
      console.log('No user data found.');
    }
  }

}