
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; 
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '../services/api';
import { firstValueFrom } from 'rxjs';
import { Preferences } from '@capacitor/preferences';


@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
  ]
})

export class IndexPage {

  constructor(
    private router: Router,
  ) {
    this.verifyLogin();//Verifica si el usuario inicio sesión y se guardó un token

  }

  private async verifyLogin() {
		const { value } = await Preferences.get({ key: 'authToken' });
		if (value) {
			this.router.navigate(['/home']);
		}
	}

}

