import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonTitle, IonToolbar, IonHeader,
  
  
  IonBackButton,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonButtons,
  IonLabel
} from '@ionic/angular/standalone';
import { ApiService } from '../services/api';
import { LoadingController, AlertController } from '@ionic/angular/standalone';


@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.page.html',
  styleUrls: ['./edit-password.page.scss'],
  standalone: true,
  imports: [
  CommonModule, 
  FormsModule, 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons,
  IonBackButton,
  
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonLabel
]
})
export class EditPasswordPage implements OnInit {

currentPassword = '';
newPassword = '';
confirmNewPassword = '';

// Inyectamos los servicios que necesitamos
constructor(
    private router: Router,
    private apiService: ApiService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() { }

    async changePassword() {
// 1. Validación: Campos vacíos
    if (!this.currentPassword || !this.newPassword || !this.confirmNewPassword) {
      this.presentAlert('Error', 'Por favor, rellena todos los campos.');
     return;
 }

 // 2. Validación: Contraseñas no coinciden
 if (this.newPassword !== this.confirmNewPassword) {
      this.presentAlert('Error', 'La nueva contraseña y su confirmación no coinciden.');
 return;
 }

    // Mostramos un indicador de carga para que el usuario sepa que algo está pasando
    const loading = await this.loadingCtrl.create({ message: 'Actualizando contraseña...' });
    await loading.present();

    // 3. Preparamos los datos para enviar a la API
    const passwordData = {
      current_password: this.currentPassword,
      new_password: this.newPassword,
      new_password_confirmation: this.confirmNewPassword
    };

    // 4. Llamamos al método del ApiService
    this.apiService.updatePassword(passwordData).subscribe({
      // Si la API responde con éxito
      next: async (response) => {
        await loading.dismiss();
        // Mostramos una alerta de éxito
        const alert = await this.alertCtrl.create({
          header: 'Éxito',
          message: '¡Contraseña actualizada correctamente!',
          buttons: [{
            text: 'OK',
            handler: () => {
              // Navegamos a otra página después de que el usuario presione OK
              this.router.navigate(['/profile']); 
            }
          }]
        });
        await alert.present();
      },
      // Si la API responde con un error
      error: async (error) => {
        await loading.dismiss();
        // Intentamos obtener un mensaje de error específico de la API
        const errorMessage = error.error?.message || 'Ocurrió un error inesperado.';
        this.presentAlert('Error al actualizar', errorMessage);
      }
    });
  }

  /**
   * Helper para mostrar alertas de forma rápida.
   */
  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}


