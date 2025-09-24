import { ApiService } from '../services/api';
import { Component, OnInit, ViewChild, NgZone, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicModule, IonInput, NavController, LoadingController, ToastController } from '@ionic/angular';

// 1. Definimos la interfaz para asegurar el tipado correcto del formulario
interface AppFormData {
  origin_address: string;
  origin_lat: number | null;
  origin_lng: number | null;
  destination_address: string;
  destination_lat: number | null;
  destination_lng: number | null;
  stop_address: string;
  stop_lat: number | null;
  stop_lng: number | null;
  description: string;
  amount: number | null;
  payment_method: string;
}

@Component({
  selector: 'app-new-requests', // Asegúrate de que coincida con tu selector
  templateUrl: './new-requests.page.html',
  styleUrls: ['./new-requests.page.scss'],
  standalone: true,
  imports: [ IonicModule, CommonModule, FormsModule ]
})
export class NewRequestsPage implements OnInit, AfterViewInit {

  @ViewChild('origenInput', { static: false }) origenInput!: IonInput;
  @ViewChild('destinoInput', { static: false }) destinoInput!: IonInput;
  @ViewChild('paradaInput', { static: false }) paradaInput!: IonInput;
  
  // 2. Usamos la interfaz para tipar el objeto formData
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

  mostrarParada = false;
  mostrarCantidadDinero = false;
  
  // 3. Inyectamos todos los servicios que vamos a usar
  constructor(
    private ngZone: NgZone,
    private http: HttpClient,
    private navController: NavController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    setTimeout(() => this.setupAutocomplete(), 400);
  }

  setupAutocomplete() {
    const gualeguaychuBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-33.033, -58.553),
      new google.maps.LatLng(-32.988, -58.484)
    );

    const options = {
      bounds: gualeguaychuBounds,
      strictBounds: true,
      componentRestrictions: { country: 'ar' },
      fields: ["address_components", "geometry", "icon", "name", "formatted_address"]
    };

    if (this.origenInput) {
      this.initAutocompleteField(this.origenInput, options, (place) => {
        this.formData.origin_address = place.formatted_address || '';
        this.formData.origin_lat = place.geometry?.location?.lat() || null;
        this.formData.origin_lng = place.geometry?.location?.lng() || null;
      });
    }

    if (this.destinoInput) {
      this.initAutocompleteField(this.destinoInput, options, (place) => {
        this.formData.destination_address = place.formatted_address || '';
        this.formData.destination_lat = place.geometry?.location?.lat() || null;
        this.formData.destination_lng = place.geometry?.location?.lng() || null;
      });
    }
    
    if (this.paradaInput) {
      this.initAutocompleteField(this.paradaInput, options, (place) => {
        this.formData.stop_address = place.formatted_address || '';
        this.formData.stop_lat = place.geometry?.location?.lat() || null;
        this.formData.stop_lng = place.geometry?.location?.lng() || null;
      });
    }
  }

  initAutocompleteField(input: IonInput, options: any, callback: (place: google.maps.places.PlaceResult) => void) {
    input.getInputElement().then((element: HTMLInputElement) => {
      const autocomplete = new google.maps.places.Autocomplete(element, options);
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            callback(place);
          }
        });
      });
    });
  }

  toggleParada(event: any) {
    this.mostrarParada = event.detail.checked;
    if (this.mostrarParada) {
      setTimeout(() => this.ngAfterViewInit(), 0);
    }
  }

  // Asegúrate de tener esta función si la usas en el HTML
  toggleDinero(event: any) {
    this.mostrarCantidadDinero = event.detail.checked;
  }

  // Función dummy para el evento (ionInput)
  soloLetras(event: any) {
    // Tu lógica de validación aquí si es necesaria
  }

  // 4. Función onSubmit completa para enviar los datos a Laravel
  async onSubmit() {
    if (!this.formData.origin_address || !this.formData.destination_address || !this.formData.description || !this.formData.payment_method) {
      this.presentToast('Por favor, completa todos los campos obligatorios.', 'danger');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Creando solicitud...',
    });
    await loading.present();

    // Reemplaza 'authToken' por la clave que uses para guardar tu token
    const token = localStorage.getItem('authToken');
    if (!token) {
      loading.dismiss();
      this.presentToast('Error de autenticación. Por favor, inicia sesión de nuevo.', 'danger');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    // Cambia la URL si es necesario
    const apiUrl = 'http://127.0.0.1:8000/api/requests';

    this.http.post(apiUrl, this.formData, { headers }).subscribe({
      next: async (response) => {
        await loading.dismiss();
        
        if (this.formData.amount) {
          localStorage.setItem('last_request_amount', this.formData.amount.toString());
        }

        await this.presentToast('¡Solicitud creada con éxito!', 'success');
        this.navController.navigateRoot('/home');
      },
      error: async (error) => {
        await loading.dismiss();
        console.error('Error al crear la solicitud:', error);
        const errorMessage = error.error?.message || 'Hubo un error al crear la solicitud. Intenta de nuevo.';
        await this.presentToast(errorMessage, 'danger');
      }
    });
  }

  // Función de ayuda para mostrar notificaciones
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