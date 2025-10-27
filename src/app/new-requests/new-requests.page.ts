import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse} from '@angular/common/http';
import { IonicModule, IonInput, NavController, LoadingController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { ApiService } from '../services/api'; //// necesario para usar la api
import { Global } from '../services/global';

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
	imports: [IonicModule, CommonModule, FormsModule]
})

export class NewRequestsPage implements OnInit {
	@ViewChild('requestForm') myForm!: NgForm;

	@ViewChild('origenInput', { static: false }) origenInput!: IonInput;
	@ViewChild('destinoInput', { static: false }) destinoInput!: IonInput;
	@ViewChild('paradaInput', { static: false }) paradaInput!: IonInput;

	formData = <AppFormData>{
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
		private apiService: ApiService,
		private ngZone: NgZone,
		private navController: NavController,
		private loadingController: LoadingController,
		private Global: Global,
	) { }


	ngOnInit() {
		// retardo para que todos los elementos estén listos
		setTimeout(() => this.setupAutocomplete(), 400);
	}

	setupAutocomplete() {
		//Función para autocompletar campos gracias a Google Maps, sugiere direcciones dentro de Gualeguaychú y Pueblo Belgrano (en al área marcada, abarca el parque industrial)
		
		const gualeguaychuBounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(-33.074616517793245, -58.62867540786411),
			new google.maps.LatLng(-32.958810800673994, -58.42979792367669)
		);

		const options = {
			bounds: gualeguaychuBounds,
			strictBounds: true,
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

	initAutocompleteField(
		input: IonInput, 
		options: any, 
		fieldPrefix: 'origin' | 'destination' | 'stop', 
		requireStreetNumber = true) {
		//esta función se encargar COMPLETAMENTE del autocompletado de las direcciones.

		input.getInputElement().then((element: HTMLInputElement) => {       //obtener el input del front
			const autocomplete = new google.maps.places.Autocomplete(element, options); // aplica el autocompletado al input
			
			autocomplete.addListener('place_changed', () => { // CUANDO EL USER SELECCIONA UNA OPCIÓN DE GOOGLE, se dispara este evento
				this.ngZone.run(() => {
					const place = autocomplete.getPlace(); //obtiene el lugar seleccionado
					// Reseteamos los errores para las direcciones
					if (fieldPrefix === 'origin') this.originMissingNumber = false;
					if (fieldPrefix === 'destination') this.destinationMissingNumber = false;

					const hasStreetNumber = place.address_components?.some(c => c.types.includes('street_number'));
					const isPlaceValid = !requireStreetNumber || hasStreetNumber;

					if (place.geometry && isPlaceValid) {
						//Si es válida la dirección, se guardan los datos en el formData
						this.formData[`${fieldPrefix}_address`] = this.formatearDireccion(place.address_components) || '';
						this.formData[`${fieldPrefix}_lat`] = place.geometry?.location?.lat() || null;
						this.formData[`${fieldPrefix}_lng`] = place.geometry?.location?.lng() || null;
						this.formData[`${fieldPrefix}_components`] = place.address_components;
						console.log(place.address_components);
					
					} else {
						// Si la dirección seleccionada de las opciones no es válida (no tiene número cuando se requiere), mostramos error
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

	formatearDireccion(components: any){
		// Función para mostrar la direción simplificada en el formulario
		const streetNumber = components?.find((c: { types: string | string[]; }) => c.types.includes('street_number'))?.long_name || '';
		const route = components?.find((c: { types: string | string[]; }) => c.types.includes('route'))?.long_name || '';
		const locality = components?.find((c: { types: string | string[]; }) => c.types.includes('locality'))?.long_name || ''; // ciudad
		//Devuelve dirección simplificada
		return (`${route} ${streetNumber}, ${locality}`.trim());
	}

	toggleDinero(event: any) {
		this.mostrarCantidadDinero = event.detail.checked;
	}

	onAddressInput(fieldType: 'origin' | 'destination' | 'stop') {

		this.formData[`${fieldType}_lat`] = null;
		this.formData[`${fieldType}_lng`] = null;

		if (fieldType === 'origin') this.originMissingNumber = false;
		if (fieldType === 'destination') this.destinationMissingNumber = false;
	}

	async onSubmit() { 
		if (this.myForm.invalid) {
    
        this.myForm.control.markAllAsTouched();
		return;
    }

		if (!this.formData.origin_lat || !this.formData.destination_lat) {
		this.Global.presentToast('Por favor, selecciona una dirección válida de la lista de sugerencias.', 'danger');
		return;
	}

		const loading = await this.loadingController.create({ message: 'Creando solicitud...' });
		await loading.present();

		const { value: token } = await Preferences.get({ key: 'authToken' });

		if (!token) {
			loading.dismiss();
			this.Global.presentToast('Error de autenticación. Por favor, inicia sesión de nuevo.', 'danger');
			return;
		}
		////// SE CREA LA REQUEST 
		(await this.apiService.createRequest(this.formData)).subscribe({
			// Esto se ejecuta si se crea con éxito la solicitud
			next: async (response: any) => {
				await loading.dismiss();
				this.navController.navigateRoot('/request-sent');
			},
		
		});

	}
}