import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-kdt-form',
  templateUrl: './kdt-form.page.html',
  styleUrls: ['./kdt-form.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule] 
})
export class KdtFormPage implements OnInit {

  formData = {
    name: '',
    lastName: '',
    dni: ''
  };

  constructor() { }

  ngOnInit() {
  }

  selectFrontDni() {
    console.log('Abriendo cámara/galería para el frente del DNI...');
    
  }

  selectBackDni() {
    console.log('Abriendo cámara/galería para el dorso del DNI...');
    
  }

  submitForm() {
    console.log('Datos del formulario a enviar:', this.formData);
    
  }
}