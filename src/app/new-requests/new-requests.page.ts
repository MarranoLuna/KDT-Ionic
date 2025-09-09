import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel,
  IonMenuButton, IonButton, IonButtons, IonList, IonItem, IonInput, IonToggle,
  IonTextarea, IonNote, IonSelect, IonSelectOption, ToastController, LoadingController } from '@ionic/angular/standalone';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-new-requests',
  templateUrl: './new-requests.page.html',
  styleUrls: ['./new-requests.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonLabel, IonMenuButton, IonButton, IonButtons, IonSelectOption,
    IonList, IonItem, IonInput, IonToggle, IonTextarea, IonNote, IonSelect
  ]
})
export class NewRequestsPage implements OnInit {

  mostrarParada: boolean = false;
  mostrarCantidadDinero: boolean = false;

  // Formulario
  formData = {
    origin: '',
    destination: '',
    stop: '',
    description: '',
    amount: null,
    payment_method: ''
  };

  constructor(
    private apiService: ApiService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  async onSubmit() {
    const loading = await this.loadingCtrl.create({
      message: 'Enviando solicitud...'
    });
    await loading.present();

    this.apiService.createRequest(this.formData).subscribe({
      next: async (res) => {
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Solicitud creada con éxito',
          duration: 2000,
          color: 'success'
        });
        toast.present();

        // reset form
        this.formData = {
          origin: '',
          destination: '',
          stop: '',
          description: '',
          amount: null,
          payment_method: ''
        };
        this.mostrarParada = false;
        this.mostrarCantidadDinero = false;
      },
      error: async (err) => {
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Error al crear solicitud ',
          duration: 2500,
          color: 'danger'
        });
        toast.present();
        console.error(err);
      }
    });
  }

  toggleParada(event: any) {
    this.mostrarParada = event.detail.checked;
  }

  toggleDinero(event: any) {
    this.mostrarCantidadDinero = event.detail.checked;
  }
}
