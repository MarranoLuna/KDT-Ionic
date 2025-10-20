// register-bicycle.page.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/services/api'; 
import { Brand } from 'src/app/interfaces/interfaces'; 
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonInput, IonButtons, IonBackButton, IonImg, IonList, IonItem, IonSelectOption, IonButton} from '@ionic/angular/standalone';


@Component({
  selector: 'app-register-bicycle',
  templateUrl: './register-bicycle.page.html',
  styleUrls: ['./register-bicycle.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonSelect, IonInput, IonButtons, IonBackButton, IonImg,IonButton, IonList, IonItem, IonSelectOption,]
})
export class RegisterBicyclePage implements OnInit {

  brands: Brand[] = [];
  selectedBrandId: number | null = null;
  color: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadBrands();
  }

  loadBrands() {
    this.apiService.getBicycleBrands().subscribe({
      next: (data) => {
        this.brands = data;
      },
      error: (error) => {
        console.error('Error al cargar las marcas de bicicleta', error);
      }
    });
  }
  
  continue() {
    console.log('ID de Marca seleccionada:', this.selectedBrandId);
    console.log('Color seleccionado:', this.color);
  }
}
