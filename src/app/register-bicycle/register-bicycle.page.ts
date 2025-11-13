// register-bicycle.page.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/services/api';
import { Global } from 'src/app/services/global';
import { UserService } from 'src/app/services/user';
import { Brand } from 'src/app/interfaces/interfaces';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController, IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonInput, IonButtons, IonBackButton, IonImg, IonList, IonItem, IonSelectOption, IonButton } from '@ionic/angular/standalone';


@Component({
  selector: 'app-register-bicycle',
  templateUrl: './register-bicycle.page.html',
  styleUrls: ['./register-bicycle.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSelect, IonInput, IonButtons, IonBackButton, IonImg, IonButton, IonList, IonItem, IonSelectOption,]
})
export class RegisterBicyclePage implements OnInit {

  @ViewChild('myForm') myForm!: NgForm;

  brands: Brand[] = [];
  selectedBrandId: number | null = null;
  color: string = '';
  coming_from: string = "register_kdt";

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private global: Global
  ) { }

  ngOnInit() {
    this.loadBrands();
    const navigation = this.router.getCurrentNavigation();// busca el objeto que enviamos de la pagina anterior
    if (navigation?.extras.state?.['coming_from'] === "new_vehicle") { /// verificamos si existe la propiedad en el objeto
      this.coming_from = navigation?.extras.state?.['coming_from'];
    }
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


  async continue() {
    if (this.myForm.invalid) {
      console.log('Formulario inválido');
      this.myForm.control.markAllAsTouched();
      return; // No continúes si es inválido
    }

    const loading = await this.loadingCtrl.create({
      message: 'Registrando bicicleta...',
    });
    await loading.present();

    const vehicleData = {
      color: this.color,
      brand_id: this.selectedBrandId!,
    };


    this.userService.registerBicycle(vehicleData).subscribe({
      next: (response) => {
        loading.dismiss();
        console.log('Bicicleta registrada:', response);
        this.next_page();// avanza a la pagina siguiente
      },
      error: async (error) => {
        loading.dismiss();
        console.error('Error al registrar la bicicleta:', error);

        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: 'No se pudo registrar tu bicicleta. Por favor, inténtalo de nuevo.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  next_page() {
    if (this.coming_from === "new_vehicle") {
      this.router.navigate(['/kdt-vehicle'], {
        state: { coming_from: 'new_vehicle' }
      });

    } else {
      this.router.navigateByUrl('/request-sent-kdt');
    }
  }

  volver() {
    this.global.go_back();
  }
}
