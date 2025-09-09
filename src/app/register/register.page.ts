import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, 
    RouterModule
  ]
})
export class RegisterPage {
  formData = {
    firstname: '',
    lastname: '',
    birthday: '',
    email: '',
    password: '',
    password_confirmation: ''
  };

  showPassword = false;

  constructor(
    private apiService: ApiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  async onRegister() {
    const loading = await this.loadingCtrl.create({
      message: 'Registrando...',
      spinner: 'crescent'
    });
    await loading.present();

    this.apiService.registerUser(this.formData).subscribe({
      next: async (response) => {
        console.log('Registration successful!', response);
        await loading.dismiss();

        const toast = await this.toastCtrl.create({
          message: 'Registro exitoso',
          duration: 2000,
          color: 'success',
          position: 'top'
        });
        toast.present();
        this.router.navigateByUrl('/home');
      },
      error: async (e: HttpErrorResponse) => {
        console.error('Registration error', e);
        await loading.dismiss();

        const toast = await this.toastCtrl.create({
          message: 'Error en el registro. Intenta nuevamente.',
          duration: 2000,
          color: 'danger',
          position: 'top'
        });
        toast.present();
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}





