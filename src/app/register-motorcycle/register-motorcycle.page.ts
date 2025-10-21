import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/services/api'; 
import { Brand } from 'src/app/interfaces/interfaces'; 
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonInput, IonButtons, IonBackButton, IonImg, IonList, IonItem, IonSelectOption, IonButton} from '@ionic/angular/standalone';

@Component({
  selector: 'app-register-motorcycle',
  templateUrl: './register-motorcycle.page.html',
  styleUrls: ['./register-motorcycle.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonSelect, IonInput, IonButtons, IonBackButton, IonImg,IonButton, IonList, IonItem, IonSelectOption,]
})
export class RegisterMotorcyclePage implements OnInit {

  brand: Brand[] = [];
  model: string = '';
  color: string = '';


  constructor(private apiService: ApiService) { }


  ngOnInit() {
    this.loadBrands();
  }

  loadBrands() {
    this.apiService.getMotorcycleBrands().subscribe({
      next: (data) => {
        this.brand = data; // Guardamos los datos de la API en nuestro array
      },
      error: (error) => {
        console.error('Error al cargar las marcas', error);
      }
    });
  }
  
  continue() {
    console.log('Marca seleccionada:', this.brand);
    console.log('Modelo seleccionado:', this.model);
    console.log('Color seleccionado:', this.color);
  }
}
