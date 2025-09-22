import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonBackButton,
  IonButton,
  IonButtons,
  IonList,
  IonItem,
  IonInput,
  IonToggle,
  IonTextarea,
  IonNote,
  IonSelect,
  IonSelectOption,
  ToastController,
  LoadingController
} from '@ionic/angular/standalone';
import { ApiService } from '../services/api';


@Component({
  selector: 'app-new-requests',
  templateUrl: './new-requests.page.html',
  styleUrls: ['./new-requests.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton,
    IonLabel, IonButton, IonButtons, IonSelectOption,
    IonList, IonItem, IonInput, IonToggle, IonTextarea, IonNote, IonSelect
  ]
})
export class NewRequestsPage implements OnInit {

  mostrarParada: boolean = false;
  mostrarCantidadDinero: boolean = false;

  soloLetras(event: any) {
    const input = event.target.value;
    const soloTexto = input.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    event.target.value = soloTexto;
  }

  // Formulario ajustado a los campos del backend
  formData = {
    origin_street: '',
    origin_number: '',
    destination_street: '',
    destination_number: '',
    stop_street: '',
    stop_number: '',
    description: '',
    amount: null,
    payment_method: ''
  };

  constructor(
    private apiService: ApiService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      message: 'Verificando sesión...',
      spinner: 'crescent'
    });
    await loading.present();
    await this.apiService.verifyLogin().then(() => loading.dismiss());
  }



  async onSubmit() {    // validaciones antes de enviar


    const originStreet = this.formData.origin_street.trim().toLowerCase();
    const destinationStreet = this.formData.destination_street.trim().toLowerCase();
    const originNumber = this.formData.origin_number.trim();
    const destinationNumber = this.formData.destination_number.trim();

    //  no permitir que calle y número sean ambos iguales
    const isStreetEqual = originStreet === destinationStreet;
    const isNumberEqual = originNumber === destinationNumber;

    if (isStreetEqual && isNumberEqual) {
      const toast = await this.toastCtrl.create({
        message: 'La dirección de Origen y Destino no pueden ser iguales.',
        duration: 2500,
        color: 'danger'
      });
      toast.present();
      return;
    }

    const numOrigen = this.formData.origin_number?.toString();
    const numDestino = this.formData.destination_number?.toString();


    if (!/^\d{1,5}(\s?[a-zA-Z]{1,4})?$|^S\/N$/i.test(numOrigen)) {
      const toast = await this.toastCtrl.create({
        message: 'El número de Origen no es válido.',
        duration: 2500,
        color: 'danger'
      });
      toast.present();
      return;
    }

    if (!/^\d{1,5}(\s?[a-zA-Z]{1,4})?$|^S\/N$/i.test(numDestino)) {
      const toast = await this.toastCtrl.create({
        message: 'El número de Destino no es válido.',
        duration: 2500,
        color: 'danger'
      });
      toast.present();
      return;
    }

    ;

    // ✅ Si pasa validaciones → sigue con API
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
          origin_street: '',
          origin_number: '',
          destination_street: '',
          destination_number: '',
          stop_street: '',
          stop_number: '',
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
          message: 'Error al crear solicitud',
          duration: 2500,
          color: 'danger'
        });
        toast.present();
        console.error(err);
      },
    });
  }

  toggleParada(event: any) {
    this.mostrarParada = event.detail.checked;
  }

  toggleDinero(event: any) {
    this.mostrarCantidadDinero = event.detail.checked;
  }

}
