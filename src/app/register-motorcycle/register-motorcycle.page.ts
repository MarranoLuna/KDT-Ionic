import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonInput, IonButtons, IonBackButton, IonImg, IonList, IonItem, IonSelectOption, IonButton} from '@ionic/angular/standalone';

@Component({
  selector: 'app-register-motorcycle',
  templateUrl: './register-motorcycle.page.html',
  styleUrls: ['./register-motorcycle.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonSelect, IonInput, IonButtons, IonBackButton, IonImg,IonButton, IonList, IonItem, IonSelectOption,]
})
export class RegisterMotorcyclePage implements OnInit {

  brand: string = '';
  model: string = '';
  color: string = '';

  constructor() { }

  ngOnInit() { }

  // Aquí irá la lógica del botón 'Continuar' más adelante
  continue() {
    console.log('Marca seleccionada:', this.brand);
    console.log('Modelo seleccionado:', this.model);
    console.log('Color seleccionado:', this.color);
  }
}
