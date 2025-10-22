import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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

  @ViewChild('registerForm') registerForm!: NgForm;

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

  private async showToast(message: string, color: 'success' | 'danger') {
  const toast = await this.toastCtrl.create({
    message,
    duration: 2000,
    position: 'top',
    color
  });
  await toast.present();
}

  async onRegister() {
    

    if (this.registerForm.invalid) {
      // Si es inválido, marcamos todos los campos como "tocados" para mostrar los errores
      this.registerForm.control.markAllAsTouched();
      // Y detenemos la ejecución de la función aquí
      return; 
    }

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
      await loading.dismiss();

      if (e.status === 422 && e.error && e.error.errors) {

        const validationErrors = e.error.errors;
        let errorMessage = 'Verifica los siguientes campos:\n';

   
        for (const key in validationErrors) {
          if (Object.prototype.hasOwnProperty.call(validationErrors, key)) {
            errorMessage += `- ${validationErrors[key][0]}\n`;
          }
        }
        this.showToast(errorMessage, 'danger');
      } else {
        // Si no es un error de validación (422), muestra un mensaje genérico.
        this.showToast('Ocurrió un error inesperado. Intenta de nuevo.', 'danger');
      }
    }
  });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}





