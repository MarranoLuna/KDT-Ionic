import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root' // para que este archivo esté disponible en toda la app
})
export class Global {
	constructor(
		private toastController: ToastController,
		private loadingController: LoadingController,
		private router: Router
	) { }

	// ACA ESCRIBIMOS TODAS LAS FUNCIONES GLOBALES QUE QUEREMOS USAR EN LA APP (LA API FUNCIONA DE LA MISMA MANERA)
	/*
		En el ts de la view se agrega este import:      import { Global } from '../services/global';
		también se agrega en el constructor:       private Global: Global
		Luego se puede usar la función así:      this.Global.presentToast('Mensaje de prueba', 'success');
	*/

	async presentToast(message: string, color: string) {
		const toast = await this.toastController.create({
			message: message,
			duration: 3000,
			position: 'top',
			color: color,
			cssClass: 'tostada'
		});
		toast.present();
	}

	async presentLoading(message: string) {
		const loading = await this.loadingController.create({
			message: message,
			cssClass: 'loading'
		});
		await loading.present();
		return loading; // devolver el loading para poder cerrarlo luego con loading.dismiss()
	}

	// Verifica si el usuario está logueado y redirige si no lo está
    async verifyLogin(): Promise<void> {
        const { value } = await Preferences.get({ key: 'authToken' });
        if (!value) {
            this.router.navigate(['/login']);
        }
    }

	recargarPagina() {
		window.location.reload();
	}
}
