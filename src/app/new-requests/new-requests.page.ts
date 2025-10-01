import { Component, OnInit, ViewChild, NgZone, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicModule, IonInput, NavController, LoadingController, ToastController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

// Interfaz para el formulario, incluyendo los componentes de dirección para enviar al backend
interface AppFormData {
  origin_address: string;
  origin_lat: number | null;
  origin_lng: number | null;
  origin_components?: any[];

  destination_address: string;
  destination_lat: number | null;
  destination_lng: number | null;
  destination_components?: any[];

  stop_address: string;
  stop_lat: number | null;
  stop_lng: number | null;
  stop_components?: any[];

  description: string;
  amount: number | null;
  payment_method: string;
}

@Component({
  selector: 'app-new-requests',
  templateUrl: './new-requests.page.html',
  styleUrls: ['./new-requests.page.scss'],
  standalone: true,
  imports: [ IonicModule, CommonModule, FormsModule ]
})
export class NewRequestsPage implements OnInit, AfterViewInit {

  @ViewChild('origenInput', { static: false }) origenInput!: IonInput;
  @ViewChild('destinoInput', { static: false }) destinoInput!: IonInput;
  @ViewChild('paradaInput', { static: false }) paradaInput!: IonInput;
  
  formData: AppFormData = {
    origin_address: '',
    origin_lat: null,
    origin_lng: null,
    destination_address: '',
    destination_lat: null,
    destination_lng: null,
    stop_address: '',
    stop_lat: null,
    stop_lng: null,
    description: '',
    amount: null,
    payment_method: ''
  };

  // Banderas para mostrar errores de validación en el HTML
  originMissingNumber = false;
  destinationMissingNumber = false;

  mostrarParada = false;
  mostrarCantidadDinero = false;
  
  constructor(
    private ngZone: NgZone,
    private http: HttpClient,
    private navController: NavController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    // Usamos un pequeño retardo para asegurar que todos los elementos estén listos
    setTimeout(() => this.setupAutocomplete(), 400);
  }

  setupAutocomplete() {
    const gualeguaychuBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-33.033, -58.553),
      new google.maps.LatLng(-32.988, -58.484)
    );

    const options = {
      bounds: gualeguaychuBounds,
      strictBounds: false,
      types: ['geocode', 'establishment'],
      fields: ["address_components", "geometry", "name", "formatted_address"]
    };

    if (this.origenInput) {
      this.initAutocompleteField(this.origenInput, options, 'origin');
    }
    if (this.destinoInput) {
      this.initAutocompleteField(this.destinoInput, options, 'destination');
    }
    if (this.paradaInput) {
      // Para la parada no exigimos número de calle
      this.initAutocompleteField(this.paradaInput, options, 'stop', false);
    }
  }

  initAutocompleteField(input: IonInput, options: any, fieldPrefix: 'origin' | 'destination' | 'stop', requireStreetNumber = true) {
    input.getInputElement().then((element: HTMLInputElement) => {
      const autocomplete = new google.maps.places.Autocomplete(element, options);
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place = autocomplete.getPlace();

          // Reseteamos las banderas de error para el campo actual
          if (fieldPrefix === 'origin') this.originMissingNumber = false;
          if (fieldPrefix === 'destination') this.destinationMissingNumber = false;
          
          const hasStreetNumber = place.address_components?.some(c => c.types.includes('street_number'));
          const isPlaceValid = !requireStreetNumber || hasStreetNumber;

          if (place.geometry && isPlaceValid) {
            this.formData[`${fieldPrefix}_address`] = place.formatted_address || '';
            this.formData[`${fieldPrefix}_lat`] = place.geometry?.location?.lat() || null;
            this.formData[`${fieldPrefix}_lng`] = place.geometry?.location?.lng() || null;
            this.formData[`${fieldPrefix}_components`] = place.address_components;
          } else {
            // Si no es válido, activamos la bandera de error y limpiamos los datos de coordenadas
            if (fieldPrefix === 'origin') this.originMissingNumber = true;
            if (fieldPrefix === 'destination') this.destinationMissingNumber = true;
            this.formData[`${fieldPrefix}_lat`] = null;
          }
        });
      });
    });
  }

  toggleParada(event: any) {
    this.mostrarParada = event.detail.checked;
    if (this.mostrarParada) {
      // Si se activa la parada, re-inicializamos el autocompletado para ese campo
      setTimeout(() => this.setupAutocomplete(), 0);
    }
  }

  toggleDinero(event: any) {
    this.mostrarCantidadDinero = event.detail.checked;
  }

  async onSubmit() {
    if (!this.formData.origin_address || !this.formData.destination_address || !this.formData.description || !this.formData.payment_method) {
      this.presentToast('Por favor, completa los campos obligatorios.', 'danger');
      return;
    }
    if (!this.formData.origin_lat || !this.formData.destination_lat) {
      this.presentToast('Las direcciones de Origen y Destino deben tener una altura (número) válida.', 'danger');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Creando solicitud...' });
    await loading.present();

    const { value: token } = await Preferences.get({ key: 'authToken' });
    
    if (!token) {
      loading.dismiss();
      this.presentToast('Error de autenticación. Por favor, inicia sesión de nuevo.', 'danger');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
    
    const apiUrl = 'http://localhost:8000/api/requests';
    

    this.http.post(apiUrl, this.formData, { headers, withCredentials: true }).subscribe({
      next: async (response) => {
        await loading.dismiss();
        if (this.formData.amount) {
          await Preferences.set({ key: 'last_request_amount', value: this.formData.amount.toString() });
        }
        await this.presentToast('¡Solicitud creada con éxito!', 'success');
        this.navController.navigateRoot('/request-sent');
      },
      error: async (error) => {
        await loading.dismiss();
        console.error('Error al crear la solicitud:', error);
        const errorMessage = error.error?.message || 'Hubo un error al crear la solicitud.';
        await this.presentToast(errorMessage, 'danger');
      }
    });
  }

  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color,
    });
    toast.present();
  }
}