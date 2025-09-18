import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../services/user';

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
    private apiService: ApiService, 
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private userService: UserService
  ) {}

  async onLogin() {
    // Mostrar spinner de carga
    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent'
    });
    await loading.present();

    this.apiService.login(this.credentials).subscribe({
      next: async (response: any) => {
        console.log('Login exitoso', response);
        this.userService.saveUser(response.user);
        await loading.dismiss();
        this.router.navigate(['/home']);
      },
      error: async (error: HttpErrorResponse) => {
        console.error('Error en el login', error);
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
