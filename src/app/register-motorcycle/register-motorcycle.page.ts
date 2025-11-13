import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/services/api';
import { UserService } from 'src/app/services/user';
import { Brand } from 'src/app/interfaces/interfaces';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Global } from 'src/app/services/global';
import { LoadingController, AlertController, IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonInput, IonButtons, IonBackButton, IonImg, IonList, IonItem, IonSelectOption, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-register-motorcycle',
  templateUrl: './register-motorcycle.page.html',
  styleUrls: ['./register-motorcycle.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSelect, IonInput, IonButtons, IonBackButton, IonImg, IonButton, IonList, IonItem, IonSelectOption]
})
export class RegisterMotorcyclePage implements OnInit {

  @ViewChild('myForm') myForm!: NgForm;

  brands: Brand[] = [];

  selectedBrandId: number | null = null;

  model: string = '';
  color: string = '';
  registration_plate: string = '';
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
      console.log(this.coming_from);
    }
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

  async continue() {
    if (this.myForm.invalid) {
      console.log('Formulario inválido');
      this.myForm.control.markAllAsTouched();
      return; // No continúes si es inválido
    }

    const loading = await this.loadingCtrl.create({
      message: 'Registrando motocicleta...', // <-- Texto cambiado
    });
    await loading.present();

    const vehicleData = {
      model: this.model,
      color: this.color,
      registration_plate: this.registration_plate,
      brand_id: this.selectedBrandId!
    };

    this.userService.registerMotorcycle(vehicleData).subscribe({
      next: (response) => {
        loading.dismiss();
        console.log('Motocicleta registrada:', response);
        this.next_page();
      },
      error: async (error) => {
        loading.dismiss();
        console.error('Error al registrar la motocicleta:', error);

        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: 'No se pudo registrar tu motocicleta. Por favor, inténtalo de nuevo.',
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
