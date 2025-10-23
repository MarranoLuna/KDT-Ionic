import { Component, OnInit, ViewChildren, QueryList, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicModule, ToastController, AlertController, IonInput, LoadingController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { ApiService } from '../services/api'; ////------------- NECESARIO PARA USAR LA API, también agregar en constructor
import { Global } from '../services/global'; //// ------------- Para usar funciones globales como la de mostrar el "Cargando..." y los errores

@Component({
	selector: 'app-requests',
	templateUrl: './requests.page.html',
	styleUrls: ['./requests.page.scss'],
	standalone: true,
	imports: [CommonModule, FormsModule, IonicModule]
})
export class RequestsPage implements OnInit {

	@ViewChildren('editingOriginInput') editingOriginInputs!: QueryList<IonInput>;
	@ViewChildren('editingDestinationInput') editingDestinationInputs!: QueryList<IonInput>;
	// AÑADIDO: "Observador" para el input de la parada que aparece al editar.
	@ViewChildren('editingStopInput') editingStopInputs!: QueryList<IonInput>;

	requests: any[] = [];
	///isLoading = true;     // loading anterior
	expandedId: number | null = null;
	editingId: number | null = null;
	editableRequest: any = {};

	private apiUrl = 'http://localhost:8000/api'; /// cambiar para que use el archivo api.ts

	constructor(
		private API: ApiService, // para llamar a la api como: this.API.funcion()
		private global: Global, // para usar funciones globales como: this.Global.presentToast('Mensaje', 'success');
		private http: HttpClient,
		private loadingController: LoadingController,
		private toastCtrl: ToastController,
		private alertCtrl: AlertController,
		private ngZone: NgZone,
	) { }

	async ngOnInit() { 
	}

	async ionViewWillEnter() {
		console.log("entra aca");
		this.loadRequests();
	}

	async loadRequests() {
		const loading = await this.global.presentLoading('Cargando solicitudes...');
		setTimeout(() => { loading.dismiss();}, 1000); // por las dudas si no se cierra solo en la logica
		const { value: token } = await Preferences.get({ key: 'authToken' });
		if (!token) {
			loading.dismiss();
			this.global.presentToast('Error de autenticación.', 'danger');
			return;
		}
		const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

		this.http.get<any[]>(`${this.apiUrl}/requests`, { headers, withCredentials: true }).subscribe({
			next: async (data) => { // <-- Se convierte la función en async

				// --- INICIO DE LA CORRECCIÓN ---
				// Recorremos cada solicitud recibida para buscar su monto guardado
				for (const request of data) {
					const { value } = await Preferences.get({ key: `request_amount_${request.id}` });
					// Le añadimos la propiedad 'amount' al objeto de la solicitud
					request.amount = value ? parseFloat(value) : null;
				}
				// --- FIN DE LA CORRECCIÓN ---

				this.requests = data;
				//this.isLoading = false;
			},
			error: (err) => {
				console.error('Error al cargar solicitudes', err);
				//this.isLoading = false;
				this.global.presentToast('Error al cargar las solicitudes.', 'danger');
			}
		});
		///loading.dismiss();
	}
	toggleDetail(id: number) {
		this.expandedId = this.expandedId === id ? null : id;
		if (this.editingId) {
			this.cancelEditing();
		}
	}

	// MODIFICADO: La función ahora es 'async' para poder leer el 'amount' guardado.
	async startEditing(request: any) {
		this.editingId = request.id;
		this.editableRequest = JSON.parse(JSON.stringify(request));

		// AÑADIDO: Si la solicitud no tiene una parada, inicializamos el objeto para evitar errores.
		if (!this.editableRequest.address) {
			this.editableRequest.address = { address: '' };
		}

		// AÑADIDO: Cargamos el monto guardado en localStorage para esta solicitud específica.
		const { value } = await Preferences.get({ key: `request_amount_${request.id}` });
		this.editableRequest.amount = value ? parseFloat(value) : null;

		setTimeout(() => this.setupEditAutocomplete(), 150);
	}

	setupEditAutocomplete() {
		// MODIFICADO: Rellenamos el código que faltaba.
		const gualeguaychuBounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(-33.033, -58.553),
			new google.maps.LatLng(-32.988, -58.484)
		);
		const options = {
			bounds: gualeguaychuBounds,
			fields: ["address_components", "formatted_address", "geometry"]
		};

		// Origen y Destino (sin cambios)
		this.editingOriginInputs.first?.getInputElement().then(input => {
			const autocomplete = new google.maps.places.Autocomplete(input, options);
			autocomplete.addListener('place_changed', () => this.ngZone.run(() => this.updateEditableAddress('origin', autocomplete.getPlace())));
		});
		this.editingDestinationInputs.first?.getInputElement().then(input => {
			const autocomplete = new google.maps.places.Autocomplete(input, options);
			autocomplete.addListener('place_changed', () => this.ngZone.run(() => this.updateEditableAddress('destination', autocomplete.getPlace())));
		});

		// AÑADIDO: Activamos el autocompletado para el campo de la parada.
		this.editingStopInputs.first?.getInputElement().then(input => {
			const autocomplete = new google.maps.places.Autocomplete(input, options);
			autocomplete.addListener('place_changed', () => {
				this.ngZone.run(() => this.updateEditableAddress('stop', autocomplete.getPlace()));
			});
		});
	}

	// MODIFICADO: Ahora también maneja el tipo 'stop'.
	updateEditableAddress(type: 'origin' | 'destination' | 'stop', place: google.maps.places.PlaceResult) {
		if (!place.geometry) return;
		const key = (type === 'stop') ? 'address' : `${type}_address`;

		this.editableRequest[key] = {
			address: place.formatted_address,
			lat: place.geometry.location?.lat() || null,
			lng: place.geometry.location?.lng() || null
		};
		(this.editableRequest as any)[`${type}_components`] = place.address_components;
	}

	cancelEditing() {
		this.editingId = null;
		this.editableRequest = {};
	}

	async saveChanges() {
		const loading = await this.loadingController.create({ message: 'Guardando...' });
		await loading.present();

		const { value: token } = await Preferences.get({ key: 'authToken' });
		const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

		// MODIFICADO: Preparamos el objeto a enviar con los nuevos campos.
		const dataToSend = {
			description: this.editableRequest.description,
			payment_method: this.editableRequest.payment_method, // <-- AÑADIDO

			origin_address: this.editableRequest.origin_address.address,
			origin_lat: this.editableRequest.origin_address.lat,
			origin_lng: this.editableRequest.origin_address.lng,
			origin_components: (this.editableRequest as any).origin_components,

			destination_address: this.editableRequest.destination_address.address,
			destination_lat: this.editableRequest.destination_address.lat,
			destination_lng: this.editableRequest.destination_address.lng,
			destination_components: (this.editableRequest as any).destination_components,

			// AÑADIDO: Enviamos los datos de la parada si se seleccionó una.
			stop_address: this.editableRequest.address?.address,
			stop_lat: this.editableRequest.address?.lat,
			stop_lng: this.editableRequest.address?.lng,
			stop_components: (this.editableRequest as any).stop_components,
		};

		// AÑADIDO: Guardamos el monto en Preferences ANTES de la llamada a la API.
		if (this.editableRequest.amount) {
			await Preferences.set({ key: `request_amount_${this.editingId}`, value: this.editableRequest.amount.toString() });
		} else {
			await Preferences.remove({ key: `request_amount_${this.editingId}` });
		}

		this.http.put(`${this.apiUrl}/requests/${this.editingId}`, dataToSend, { headers, withCredentials: true }).subscribe({
			next: (updatedRequest: any) => {
				const index = this.requests.findIndex(r => r.id === this.editingId);
				if (index !== -1) {
					// AÑADIDO: Re-asignamos el monto local a la respuesta para que se vea en la lista.
					updatedRequest.amount = this.editableRequest.amount;
					this.requests[index] = updatedRequest;
				}
				loading.dismiss();
				this.global.presentToast('Solicitud actualizada.', 'success');
				this.cancelEditing();
			},
			error: (err) => {
				loading.dismiss();
				console.error('Error al actualizar:', err); // AÑADIDO: Log del error para más detalles.
				this.global.presentToast('No se pudo actualizar la solicitud.', 'danger');
			}
		});
	}

	async confirmDelete(request: any) {

		const alert = await this.alertCtrl.create({

			header: 'Confirmar Eliminación',

			message: `¿Estás seguro?`,

			buttons: [

				{ text: 'Cancelar', role: 'cancel' },

				{ text: 'Eliminar', role: 'destructive', handler: () => this.deleteRequest(request.id) }

			]

		});

		await alert.present();

	}



	async deleteRequest(id: number) {

		const loading = await this.loadingController.create({ message: 'Eliminando...' });

		await loading.present();



		const { value: token } = await Preferences.get({ key: 'authToken' });

		const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });


		this.http.delete(`${this.apiUrl}/requests/${id}`, { headers, withCredentials: true }).subscribe({

			next: () => {

				this.requests = this.requests.filter(r => r.id !== id);

				loading.dismiss();

				this.global.presentToast('Solicitud eliminada.', 'success');

			},

			error: (err) => {

				loading.dismiss();

				this.global.presentToast('No se pudo eliminar la solicitud.', 'danger');
			}

		});

	}


}
