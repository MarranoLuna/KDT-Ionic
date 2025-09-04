import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

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

  constructor(private apiService: ApiService, private router: Router) {}

  onLogin() {
    this.apiService.login(this.credentials).subscribe({
      next: (response: any) => {
        console.log('Login exitoso', response);
        this.router.navigate(['/home']); // Redirigir a la página principal
      },
      error: () => {
        console.log('Error en el login');
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
