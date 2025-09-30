import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';



@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule
	]
})


export class LoginPage {
	credentials = {
		email: '',
		password: ''
	};

	showPassword = false;

	constructor(
		private apiService: UserService,
		private router: Router,
		private loadingCtrl: LoadingController,
		private toastCtrl: ToastController,
		private userService: UserService

	) {
		this.apiService.verifyLogin();//Verifica si el usuario inicio sesión y se guardó un token
	}

	// FUNCIÓN PARA LOGUEARSE
	async onLogin() {
		// Mostrar spinner de carga
		const loading = await this.loadingCtrl.create({
			message: 'Iniciando sesión...',
			spinner: 'crescent'
		});
		await loading.present();

		/////// CONFLICTO
		this.userService.login(this.credentials).subscribe({
			next: async (response: any) => {
				console.log('Login exitoso', response);
				await loading.dismiss();  // 🔹 oculto el cargando
				this.userService.saveUser(response.user);
				await Preferences.set({ key: 'authToken', value: response.token });
				this.router.navigate(['/home']);
			},
			error: async (error: HttpErrorResponse) => {
				await loading.dismiss();
				this.showToast('Usuario o contraseña incorrectos ❌', 'danger');
			}
		});
	}

	togglePassword() {
		this.showPassword = !this.showPassword;
	}

	private async showToast(message: string, color: 'success' | 'danger') {
		const toast = await this.toastCtrl.create({
			message,
			duration: 2000,
			position: 'top',
			color
		});
		await toast.present();
	}
}
