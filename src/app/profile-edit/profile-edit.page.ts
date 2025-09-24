import { Component, OnInit } from '@angular/core';
import { ApiService, UserData } from 'src/app/services/api';
import { UserService } from 'src/app/services/user';
import { Router } from '@angular/router';
import {
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonMenuButton, 
  IonAvatar,
  IonContent, 
  IonBackButton,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  LoadingController
} from '@ionic/angular/standalone';

import { FormsModule } from '@angular/forms';

import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonAvatar,
    IonContent, 
    RouterLink, RouterLink, IonContent,  IonToolbar,  IonHeader,  IonButtons, IonTitle, 
  IonBackButton, IonList, IonItem, IonInput, IonButton, FormsModule
  ]
})
export class ProfileEditPage implements OnInit {

  userData: UserData = { id: 0, firstname: '', lastname: '', email: '', password: '', birthdate: '' };

  currentUserId: number | null = null;

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private router: Router
  ) { }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent'
    });
    await loading.present();
    await this.apiService.verifyLogin().then(() => loading.dismiss());

    this.currentUserId = this.userService.getCurrentUserId();


    if (this.currentUserId) {
      this.getUserData(); 
    } else {
      console.error('No se encontro un ID de usuario');
      
    }
  }

  // Obtener los datos
  getUserData() {
 
    this.apiService.getUserData(this.currentUserId!).subscribe({
      next: data => {
      console.log('Datos RECIBIDOS de la API:', data);

      
      if (Array.isArray(data) && data.length > 0) {
        this.userData = data[0]; 
      } else if (!Array.isArray(data) && data) {
        this.userData = data; 
      } 

      if (this.userData && this.userData.birthdate) {
          this.userData.birthdate = this.userData.birthdate.split('T')[0];
      }
    },
      error: error => {
        console.error('Error al obtener los datos:', error);
      }
    });
  }

  //Guardar los datos
  saveChanges() {
    
    this.apiService.updateUserData(this.currentUserId!, this.userData).subscribe({
      next: response => {
        console.log('Usuario actualizado:', response);
      },
      error: error => {
        console.error('Error al actualizar el usuario:', error);
      }
    });
  }
}

