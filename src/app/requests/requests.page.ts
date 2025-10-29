import { Component, OnInit, ViewChildren, QueryList, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// NOTA: HttpClient y HttpHeaders ya no son necesarios aquí si ApiService los maneja
// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicModule, LoadingController, ToastController, AlertController, IonInput } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api'; // Tu servicio de API
import { Global } from '../services/global';   // Tu servicio Global

@Component({
    selector: 'app-requests',
    templateUrl: './requests.page.html',
    styleUrls: ['./requests.page.scss'],
    standalone: true,
    imports: [RouterModule, CommonModule, FormsModule, IonicModule]
})
export class RequestsPage implements OnInit {

    // Observadores para los inputs de edición
    @ViewChildren('editingOriginInput') editingOriginInputs!: QueryList<IonInput>;
    @ViewChildren('editingDestinationInput') editingDestinationInputs!: QueryList<IonInput>;
    @ViewChildren('editingStopInput') editingStopInputs!: QueryList<IonInput>;

    // --- Propiedades del Componente ---
    requests: any[] = [];
    isLoading = true; // Para mostrar/ocultar spinner o mensaje de "No tienes..."
    expandedId: number | null = null;
    editingId: number | null = null;
    editableRequest: any = {};
    
    // Almacena las ofertas por ID de solicitud
    offers: { [requestId: number]: any[] } = {};
    // Controla el spinner de carga de ofertas
    loadingOffersForRequest: number | null = null;

    // Ya no es necesaria, ApiService maneja la URL
    // private apiUrl = '...'; 

    constructor(
        private API: ApiService,
        private global: Global,
        private alertCtrl: AlertController,
        private ngZone: NgZone,
        // Ya no son necesarias si Global las maneja:
        // private loadingController: LoadingController,
        // private toastCtrl: ToastController,
        // private http: HttpClient, 
    ) { }

    ngOnInit() { }

    async ionViewWillEnter() {
        this.global.verifyLogin(); // Verifica si el usuario está logueado
        this.loadRequests();       // Carga las solicitudes
    }

    // Carga las solicitudes del usuario
    async loadRequests() {
    this.isLoading = true;
    const loading = await this.global.presentLoading('Cargando solicitudes...');

    // CORRECCIÓN: Añadimos (await ...) antes de la llamada
    (await this.API.getRequests()).subscribe({ 
        next: async (data: any) => { 
            for (const request of data) {
                const { value } = await Preferences.get({ key: `request_amount_${request.id}` });
                request.amount = value ? parseFloat(value) : null;
            }
            this.requests = data;
            this.isLoading = false; 
            loading.dismiss();
        },
        error: (err: any) => {
            console.error('Error al cargar solicitudes', err);
            this.isLoading = false; 
            loading.dismiss();
            this.global.presentToast('Error al cargar las solicitudes.', 'danger');
        }
    });
}

    getStatusColor(statusName: string | undefined): string {
    if (!statusName) return 'medium'; 
    const lowerCaseStatus = statusName.toLowerCase();

    if (lowerCaseStatus.includes('pendiente')) {
        return 'medium'; // Gris
    } else if (lowerCaseStatus.includes('ofertada')) { // 'Con Ofertas' o 'Ofertada'
        return 'secondary'; // Color (ej: Violeta)
    } else if (lowerCaseStatus.includes('aceptado')) {
        return 'success'; // Verde
    } else {
        return 'medium'; // Color por defecto
    }
  }
  
    // Muestra/Oculta los detalles de la solicitud y carga las ofertas
    async toggleDetail(id: number) {
        const isOpening = this.expandedId !== id;
        this.expandedId = isOpening ? id : null;
        
        if (this.editingId) { this.cancelEditing(); }

        const request = this.requests.find(r => r.id === id);
        // Carga ofertas si se abre el detalle y el estado es 'Con Ofertas' (ej: ID 2)
        if (isOpening && !this.offers[id] && (request?.request_status_id === 2)) {
            await this.loadOffersForRequest(id);
        }
    }

    // Carga las ofertas para una solicitud específica
    async loadOffersForRequest(requestId: number) {
        this.loadingOffersForRequest = requestId;
        this.API.getRequestOffers(requestId).subscribe({
            next: (data: any) => {
                this.ngZone.run(() => {
                    this.offers[requestId] = data;
                    this.loadingOffersForRequest = null;
                });
            },
            error: (err: any) => {
                console.error(`Error al cargar ofertas para request ${requestId}`, err);
                this.ngZone.run(() => { this.loadingOffersForRequest = null; });
                this.global.presentToast('No se pudieron cargar las ofertas.', 'danger');
            }
        });
    }

    // Muestra la confirmación para aceptar una oferta
    async acceptOffer(request: any, offer: any) {
        const alert = await this.alertCtrl.create({
            header: 'Confirmar Aceptación',
            message: `¿Aceptar la oferta de ${offer.courier?.firstname || 'KDT'} por $${offer.price}?`,
            buttons: [
                { text: 'Cancelar', role: 'cancel' },
                { text: 'Aceptar', handler: () => this.sendAcceptanceToApi(request, offer) }
            ]
        });
        await alert.present();
    }

    // Envía la aceptación de la oferta a la API
    async sendAcceptanceToApi(request: any, offer: any) {
        const loading = await this.global.presentLoading('Aceptando oferta...');
        this.API.acceptOffer(request.id, offer.id).subscribe({
            next: (response: any) => {
                loading.dismiss();
                this.global.presentToast(response.message || 'Oferta aceptada.', 'success');
                this.ngZone.run(() => {
                    // Actualiza el estado localmente
                    const index = this.requests.findIndex(r => r.id === request.id);
                    if (index !== -1) {
                        this.requests[index].request_status_id = 3; // Asumimos 3 = Aceptado
                        this.requests[index].status = { name: 'Aceptado' };
                    }
                    this.expandedId = null; // Cierra el detalle
                });
            },
            error: (err: any) => {
                loading.dismiss();
                const message = err.error?.message || 'No se pudo aceptar la oferta.';
                this.global.presentToast(message, 'danger');
            }
        });
    }

    // --- Funciones de Edición ---
    async startEditing(request: any) {
        this.editingId = request.id;
        this.editableRequest = JSON.parse(JSON.stringify(request));
        if (!this.editableRequest.address) { this.editableRequest.address = { address: '' }; }
        const { value } = await Preferences.get({ key: `request_amount_${request.id}` });
        this.editableRequest.amount = value ? parseFloat(value) : null;
        setTimeout(() => this.setupEditAutocomplete(), 150);
    }

    setupEditAutocomplete() {
        const gualeguaychuBounds = new google.maps.LatLngBounds(
             new google.maps.LatLng(-33.033, -58.553),
             new google.maps.LatLng(-32.988, -58.484)
        );
        const options = {
             bounds: gualeguaychuBounds,
             fields: ["address_components", "formatted_address", "geometry"]
        };

        this.editingOriginInputs.first?.getInputElement().then((input: HTMLInputElement) => {
            const autocomplete = new google.maps.places.Autocomplete(input, options);
            autocomplete.addListener('place_changed', () => this.ngZone.run(() => this.updateEditableAddress('origin', autocomplete.getPlace())));
        });
        this.editingDestinationInputs.first?.getInputElement().then((input: HTMLInputElement) => {
            const autocomplete = new google.maps.places.Autocomplete(input, options);
            autocomplete.addListener('place_changed', () => this.ngZone.run(() => this.updateEditableAddress('destination', autocomplete.getPlace())));
        });
        this.editingStopInputs.first?.getInputElement().then((input: HTMLInputElement) => {
            const autocomplete = new google.maps.places.Autocomplete(input, options);
            autocomplete.addListener('place_changed', () => this.ngZone.run(() => this.updateEditableAddress('stop', autocomplete.getPlace())));
        });
    }

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
    if (this.editingId === null) {
        this.global.presentToast('Error: No se ha seleccionado una solicitud para editar.', 'danger');
        return; 
    }

    const loading = await this.global.presentLoading('Guardando...');

    // CORRECCIÓN: Añadimos el 'id' al objeto dataToSend
    const dataToSend = {
        id: this.editingId, // <-- ID AÑADIDO AQUÍ
        description: this.editableRequest.description,
        payment_method: this.editableRequest.payment_method,
        origin_address: this.editableRequest.origin_address?.address,
        origin_lat: this.editableRequest.origin_address?.lat,
        origin_lng: this.editableRequest.origin_address?.lng,
        origin_components: (this.editableRequest as any).origin_components,
        destination_address: this.editableRequest.destination_address?.address,
        destination_lat: this.editableRequest.destination_address?.lat,
        destination_lng: this.editableRequest.destination_address?.lng,
        destination_components: (this.editableRequest as any).destination_components,
        stop_address: this.editableRequest.address?.address,
        stop_lat: this.editableRequest.address?.lat,
        stop_lng: this.editableRequest.address?.lng,
        stop_components: (this.editableRequest as any).stop_components,
    };

        if (this.editableRequest.amount) {
            await Preferences.set({ key: `request_amount_${this.editingId}`, value: this.editableRequest.amount.toString() });
        } else {
            await Preferences.remove({ key: `request_amount_${this.editingId}` });
        }

       this.API.updateRequest(dataToSend).subscribe({ 
        next: (updatedRequest: any) => {
            const index = this.requests.findIndex(r => r.id === this.editingId);
            if (index !== -1) {
                updatedRequest.amount = this.editableRequest.amount;
                this.requests[index] = updatedRequest;
            }
            loading.dismiss();
            this.global.presentToast('Solicitud actualizada.', 'success');
            this.cancelEditing();
        },
        error: (err: any) => {
            loading.dismiss();
            console.error('Error al actualizar:', err);
            this.global.presentToast('No se pudo actualizar la solicitud.', 'danger');
        }
    });
}

    // --- Funciones de Eliminación ---
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
        const loading = await this.global.presentLoading('Eliminando solicitud...');
        this.API.deleteRequest(id).subscribe({
            next: () => {
                this.requests = this.requests.filter(r => r.id !== id);
                loading.dismiss();
                this.global.presentToast('Solicitud eliminada.', 'success');
            },
            error: (err: any) => {
                loading.dismiss();
                console.error('Error al eliminar:', err);
                this.global.presentToast('No se pudo eliminar la solicitud.', 'danger');
            }
        });
    }

} // Fin de la clase