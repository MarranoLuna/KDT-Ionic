import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/services/api'; 
import { Brand } from 'src/app/interfaces/interfaces'; 
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonInput, IonButtons, IonBackButton, IonImg, IonList, IonItem, IonSelectOption, IonButton} from '@ionic/angular/standalone';

@Component({
  selector: 'app-register-motorcycle',
  templateUrl: './register-motorcycle.page.html',
  styleUrls: ['./register-motorcycle.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonSelect, IonInput, IonButtons, IonBackButton, IonImg,IonButton, IonList, IonItem, IonSelectOption,]
})
export class RegisterMotorcyclePage implements OnInit {

  @ViewChild('myForm') myForm!: NgForm;

  brands: Brand[] = [];

  selectedBrandId: number | null = null;

  model: string = '';
  color: string = '';
  registration_plate: string = '';


  constructor(private apiService: ApiService, private router: Router) { }


  ngOnInit() {
    this.loadBrands();
  }

  loadBrands() {
    this.apiService.getMotorcycleBrands().subscribe({
      next: (data) => {
        this.brands = data; 
      },
      error: (error) => {
        console.error('Error al cargar las marcas', error);
      }
    });
  }
  
  continue() {
    if (this.myForm.valid) {
      console.log('Formulario válido, navegando...');
      this.router.navigateByUrl('/request-sent-kdt');
    } else {
      console.log('Formulario inválido');
      this.myForm.control.markAllAsTouched();
    }
  }
}
