
import { Component, ViewChild, NgZone, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { IonicModule, IonInput, LoadingController, ToastController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

// Interfaz para tipar las direcciones que vienen de la API
interface Address {
  id: number;
  address: string;
  lat: number;
  lng: number;
  user_id: number;
}


@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
  standalone: true,

  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddressPage implements AfterViewInit {

  @ViewChild('addressInput', { static: false }) addressInput!: IonInput;

  // Objeto para guardar los datos de la nueva dirección
  newAddress = {
    address: '',
    lat: null as number | null,
    lng: null as number | null,
    intersection: '',
    floor: '',
    department: ''
  };

  savedAddresses: Address[] = [];
  isLoading = true;
  apiUrl = 'http://127.0.0.1:8000/api';

  constructor(
    private ngZone: NgZone,
    private http: HttpClient,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  // actualiza cada vez que se entra a la página
  ionViewWillEnter() {
    this.loadAddresses();
  }

  ngAfterViewInit() {
    this.setupAutocomplete();
  }

  // --- Lógica de Google Maps ---
  setupAutocomplete() {
    this.addressInput.getInputElement().then((element: HTMLInputElement) => {
      const gualeguaychuBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-33.033, -58.553),
      );
      const options = {
        bounds: gualeguaychuBounds,
        strictBounds: true,
        fields: ["address_components", "formatted_address", "geometry"]
      };

      const autocomplete = new google.maps.places.Autocomplete(element, options);
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place = autocomplete.getPlace();
          if (place.geometry && place.formatted_address) {
            this.newAddress.address = place.formatted_address;
            this.newAddress.lat = place.geometry?.location?.lat() || null;
            this.newAddress.lng = place.geometry?.location?.lng() || null;
            (this.newAddress as any).address_components = place.address_components;
          }
        });
      });
    });
  }

  
  // --- Lógica de la API ---
  async  loadAddresses() {
    this.isLoading = true;
    const { value: token } = await Preferences.get({ key: 'authToken' });
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<Address[]>(`${this.apiUrl}/addresses`, { headers }).subscribe({
      next: (data) => {
        this.savedAddresses = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar las direcciones', error);
        this.presentToast('No se pudieron cargar las direcciones.', 'danger');
        this.isLoading = false;
      }
    });
  }

  async saveAddress() {
    const loading = await this.loadingController.create({ message: 'Guardando...' });
    await loading.present();

const { value: token } = await Preferences.get({ key: 'authToken' });
    if (!token) {
      loading.dismiss();
      this.presentToast('Error de autenticación.', 'danger');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.post(`${this.apiUrl}/addresses`, this.newAddress, { headers }).subscribe({
      next: () => {
        loading.dismiss();
        this.presentToast('¡Dirección guardada con éxito!', 'success');
        this.resetForm();
        this.loadAddresses();
      },
      error: (error) => {
        loading.dismiss();
        this.presentToast('Hubo un error al guardar la dirección.', 'danger');
      }
    });
  }
  
  // --- Funciones de Ayuda ---
  resetForm() {
    this.newAddress = { address: '', lat: null, lng: null, intersection: '', floor: '', department: ''  };
  }

  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color,
    });
    toast.present();
  }}

