import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
	providedIn: 'root' // para que este archivo esté disponible en toda la app
})
export class Global {
	constructor(
		private toastController: ToastController
	) { }

	// ACA ESCRIBIMOS TODAS LAS FUNCIONES GLOBALES QUE QUEREMOS USAR EN LA APP (LA API FUNCIONA DE LA MISMA MANERA)
	/*
		En el ts de la view se agrega este import:      import { Global } from '../services/global';
		también se agrega en el constructor:       private Global: Global
		Luego se puede usar la función así:      this.Global.presentToast('Mensaje de prueba', 'success');
	*/

	async presentToast(message: string, color: 'success' | 'danger') {
		const toast = await this.toastController.create({
			message: message,
			duration: 3000,
			position: 'top',
			color: color,
			cssClass: 'tostada'
		});
		toast.present();
	}
}
