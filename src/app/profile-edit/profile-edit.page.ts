import { Component, OnInit } from '@angular/core';
import { ApiService, UserData } from 'src/app/services/api';
import { UserService } from 'src/app/services/user';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import {
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonAvatar,
  IonContent, 
  IonBackButton,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  LoadingController,
  IonLabel,
} from '@ionic/angular/standalone';

import { FormsModule } from '@angular/forms';

import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons,  IonAvatar,

    IonContent, 
    RouterLink, RouterLink, IonContent,  IonToolbar,  IonHeader,  IonButtons, IonTitle, 
  IonBackButton, IonList, IonItem, IonInput, IonButton, FormsModule, IonLabel
  ]
})
export class ProfileEditPage implements OnInit {

  userData: UserData = { id: 0, firstname: '', lastname: '', email: '', password: '', birthday: '', avatar: '' };

  currentUserId: number | null = null;

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private router: Router
  ) { defineCustomElements(window); }


  async ngOnInit() {
    const loading = await this.loadingCtrl.create({ message: 'Cargando...' });
    await loading.present();

    // Obtenemos el objeto de usuario completo desde Preferences
    const userFromPrefs = await this.userService.getCurrentUser();

    if (userFromPrefs) {
      // Rellenamos el modelo del formulario con esos datos
      this.userData = userFromPrefs;
      
      // Formateamos la fecha, igual que antes
      if (this.userData.birthday) {
        this.userData.birthday = this.userData.birthday.split('T')[0];
      }
    } else {
      console.error('No se encontraron datos de usuario. Redirigiendo al login.');
      this.router.navigate(['/login']);
    }
    
    await loading.dismiss();
  }


  async changeAvatar() {
    console.log('Abriendo cámara para avatar');
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true, // Cambiado a 'true', es mejor para un avatar (permite recortar)
        resultType: CameraResultType.DataUrl, // ¡Perfecto! Nos da base64
        source: CameraSource.Prompt, 
        promptLabelHeader: 'Seleccionar Foto',
        promptLabelPhoto: 'Elegir de la galería',
        promptLabelPicture: 'Tomar foto con la cámara'
      });

      if (image.dataUrl) {
        // 4. ASIGNA LA IMAGEN AL OBJETO 'userData'
        // El HTML [src] se actualizará automáticamente.
        this.userData.avatar = image.dataUrl;
      }
    } catch (error) {
      console.error('Error al cambiar el avatar', error);
    }
  }



  //Guardar los datos
  async saveChanges() {
    if (!this.userData.id) {
    console.error('No hay un ID de usuario para actualizar.');
    return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Guardando cambios...' });
    await loading.present();
    // Paso 1: Enviar los datos actualizados a la API
    this.apiService.updateUserData(this.userData.id, this.userData).subscribe({
    next: async (response) => {
    console.log('Usuario actualizado en la API:', response);

    //Guardamos la respuesta del servidor 
    await this.userService.saveUser(response);
    console.log('Datos locales actualizados en Preferences.');

    await loading.dismiss();

    // Navegar de vuelta al perfil del usuario
    this.router.navigate(['/home']);
    },
    error: async (error) => {
    console.error('Error al actualizar el usuario:', error);
    await loading.dismiss();
    }
});
 
}}

