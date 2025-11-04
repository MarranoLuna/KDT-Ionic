

import { Component, ViewChild, NgZone, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { IonicModule, IonInput, LoadingController, ToastController,AlertController} from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { HttpErrorResponse } from '@angular/common/http';



// Interfaz para tipar las direcciones que vienen de la API
interface Address {
  id: number;
  address: string;
  lat: number;
  lng: number;
  user_id: number;
  intersection?: string; 
  floor?: string;       
  department?: string;   
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
  @ViewChild('intersectionInput', { static: false }) intersectionInput!: IonInput;

  isIntersectionSelected = false;
  addressMissingNumber = false;

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
  apiUrl = 'http://localhost:8000/api';

  constructor(
    private ngZone: NgZone,
    private http: HttpClient,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
    private toastCtrl: ToastController,
  ) { }

  // actualiza cada vez que se entra a la página
  ionViewWillEnter() {
    this.loadAddresses();
  }

  ngAfterViewInit() {
    this.setupAutocomplete();
  }

  setupAutocomplete() {
    if (this.addressInput) {
        this.addressInput.getInputElement().then((element: HTMLInputElement) => {
            const gualeguaychuBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(-33.033, -58.553),
                new google.maps.LatLng(-32.988, -58.484)
            );
            const options = {
                bounds: gualeguaychuBounds,
                strictBounds: false,
                types: ['geocode', 'establishment'],
                fields: ["address_components", "formatted_address", "geometry"]
            };

            const autocomplete = new google.maps.places.Autocomplete(element, options);
            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    const place = autocomplete.getPlace();
                    this.addressMissingNumber = false;

                    if (place.geometry && place.formatted_address) {
                        const hasStreetNumber = place.address_components?.some(
                            c => c.types.includes('street_number')
                        );

                        if (hasStreetNumber) {
                            this.newAddress.address = place.formatted_address;
                            this.newAddress.lat = place.geometry?.location?.lat() || null;
                            this.newAddress.lng = place.geometry?.location?.lng() || null;
                            (this.newAddress as any).address_components = place.address_components;
                        } else {
                            this.addressMissingNumber = true;
                            this.newAddress.lat = null;
                            this.newAddress.lng = null;
                        }
                    }
                });
            });
        });
    }
    if (this.intersectionInput) {
        this.intersectionInput.getInputElement().then((element: HTMLInputElement) => {
            const gualeguaychuBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(-33.033, -58.553),
                new google.maps.LatLng(-32.988, -58.484)
            );
            const options = {
                bounds: gualeguaychuBounds,
                types: ['geocode'],
                fields: ["address_components", "name"]
            };

            const autocomplete = new google.maps.places.Autocomplete(element, options);
            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    const place = autocomplete.getPlace();
                    let street = '';
                    if (place.address_components) {
                        const routeComponent = place.address_components.find(c => c.types.includes('route'));
                        if (routeComponent) {
                            street = routeComponent.long_name;
                        }
                    }
                    this.newAddress.intersection = street || place.name || '';
                    this.isIntersectionSelected = true;
                });
            });
        });
    }
}


onIntersectionInput() {
  
        this.isIntersectionSelected = false;
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
   
    if (!this.newAddress.address || !this.newAddress.lat) {
        this.presentToast('Por favor, selecciona una dirección válida.', 'danger');
        return;
    }

    
    if (this.newAddress.intersection && !this.isIntersectionSelected) {
        this.presentToast('Por favor, selecciona una intersección válida de la lista.', 'danger');
        return;
    }

    
    const loading = await this.loadingController.create({
      message: 'Guardando...',
    });
    await loading.present();


 
    const { value: token } = await Preferences.get({ key: 'authToken' });

    if (!token) {
      loading.dismiss();
      this.presentToast('Error de autenticación. Por favor, inicia sesión de nuevo.', 'danger');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });


    
    this.http.post(`${this.apiUrl}/addresses`, this.newAddress, { headers, withCredentials: true }).subscribe({
     
      next: () => {
        loading.dismiss();
        this.presentToast('¡Dirección guardada con éxito!', 'success');
        this.resetForm(); 
        this.loadAddresses();
      },
      
      error: (error) => {
        loading.dismiss();
        console.error('Error al guardar la dirección', error);
        this.presentToast('Hubo un error al guardar la dirección.', 'danger');
      }
    });
  }
  
  // --- Funciones de Ayuda ---
  resetForm() {
    this.newAddress = { address: '', lat: null, lng: null, intersection: '', floor: '', department: ''  };
    this.isIntersectionSelected = false;
  }


  
//confirmación
    async confirmDelete(address: Address) {
        const alert = await this.alertController.create({
            header: 'Confirmar Eliminación',
            message: `¿Estás seguro de que quieres eliminar la dirección "${address.address}"?`,
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                }, {
                    text: 'Eliminar',
                    cssClass: 'danger',
                    handler: () => {
                        this.deleteAddress(address.id); // Llama a la función que borra
                    }
                }
            ]
        });
        await alert.present();
    }

    //llamada a API 
   async deleteAddress(addressId: number) {
    const loading = await this.loadingController.create({
        message: 'Eliminando...',
    });
    await loading.present();

    const { value: token } = await Preferences.get({ key: 'authToken' });
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });

    
    this.http.delete(`${this.apiUrl}/addresses/${addressId}`, { headers, withCredentials: true }).subscribe({
        next: () => {
            loading.dismiss();
            this.presentToast('Dirección eliminada con éxito', 'success');
            // Actualiza la lista en la UI
            this.savedAddresses = this.savedAddresses.filter(addr => addr.id !== addressId); 
        },
        
        // --- ¡BLOQUE DE ERROR MODIFICADO! ---
        error: (err: HttpErrorResponse) => {
            loading.dismiss();
            console.error('Error al eliminar la dirección', err);

            let toastMessage = 'No se pudo eliminar la dirección.';
            let toastColor: 'danger' | 'warning' = 'danger'; // Color por defecto

            // 1. Verificamos si es el error 409 (Conflict)
            if (err.status === 409) {
                toastColor = 'warning'; // Lo cambiamos a amarillo (advertencia)

                // 2. Extraemos el mensaje específico que envió tu API
                // (err.error.message viene de tu JSON: {message: "Esta dirección..."})
                if (err.error && err.error.message) {
                    toastMessage = err.error.message;
                } else {
                    // Mensaje de respaldo si la API no envía un mensaje
                    toastMessage = 'Esta dirección está en uso y no se puede eliminar.';
                }
            }
            // (Puedes añadir más 'else if' para otros errores, como 401, 404, etc.)

            // 3. Mostramos el toast (genérico o específico)
            this.presentToast(toastMessage, toastColor);
        }
    });
}

/**
 * Helper para mostrar Toasts
 * (Asegúrate de tener esta función en tu página y de inyectar 'toastCtrl' 
 * en tu constructor)
 */
async presentToast(message: string, color: 'success' | 'danger' | 'warning') {
  const toast = await this.toastCtrl.create({
    message: message,
    duration: 3500, // Más tiempo para que se pueda leer el error
    color: color,
    position: 'top'
  });
  toast.present();
}
}



