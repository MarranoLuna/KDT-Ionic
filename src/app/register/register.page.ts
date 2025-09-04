import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api';
import { HttpErrorResponse } from '@angular/common/http';

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
  // Update this object to match your form fields
  formData = {
    firstname: '',
    lastname: '',
    birthday: '',
    email: '',
    password: '',
    password_confirmation: ''
  };

  showPassword = false; // Property for the password visibility toggle

  constructor(private apiService: ApiService) {}

  onRegister() {
    this.apiService.registerUser(this.formData).subscribe({
      next: (response) => {
        console.log('Registration successful!', response);
        // Navigate to the login page or show a success message
      },
      error: (e: HttpErrorResponse) => {
        console.error('Registration error', e);
        // Show a user-friendly error message
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}






