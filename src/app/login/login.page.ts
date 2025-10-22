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
		// Muestra un indicador de carga para el usuario
		const loading = await this.loadingCtrl.create({
			message: 'Iniciando sesión...',
			spinner: 'crescent'
		});
		await loading.present();

		// Llama al servicio que se encarga de la petición a la API
		this.userService.login(this.credentials).subscribe({
			// Esto se ejecuta si el login es EXITOSO
			next: async (response: any) => {
				console.log('Login exitoso', response);
				await loading.dismiss();

				// Guarda los datos recibidos del backend
				this.userService.saveUser(response.user);
				await Preferences.set({ key: 'authToken', value: response.token });
				await Preferences.set({ key: 'userRole', value: response.user.role.name });

				// Revisa el rol del usuario y lo redirige a la pantalla correcta
				if (response.user.role.name === 'kdt') {
					this.router.navigate(['/kdt-home']);
				} else {
					this.router.navigate(['/home']);
				}
			},
			// Esto se ejecuta si el login FALLA
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
