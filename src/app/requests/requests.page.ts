import { Component, OnInit, ViewChildren, QueryList, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicModule, LoadingController, ToastController, AlertController, IonInput } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonicModule ]
})
export class RequestsPage implements OnInit {

  @ViewChildren('editingOriginInput') editingOriginInputs!: QueryList<IonInput>;
  @ViewChildren('editingDestinationInput') editingDestinationInputs!: QueryList<IonInput>;

  requests: any[] = [];
  isLoading = true;
  expandedId: number | null = null;
  editingId: number | null = null;
  editableRequest: any = {};
  
  private apiUrl = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {}
  
  ionViewWillEnter() {
    this.loadRequests();
  }

  async loadRequests() {
    this.isLoading = true;
    const { value: token } = await Preferences.get({ key: 'authToken' });
    if (!token) {
        this.isLoading = false;
        this.presentToast('Error de autenticación.', 'danger');
        return;
    }
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<any[]>(`${this.apiUrl}/requests`, { headers, withCredentials: true }).subscribe({
      next: (data) => {
        this.requests = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar solicitudes', err);
        this.isLoading = false;
        this.presentToast('Error al cargar las solicitudes.', 'danger');
      }
    });
  }

  toggleDetail(id: number) {
    this.expandedId = this.expandedId === id ? null : id;
    if (this.editingId) {
      this.cancelEditing();
    }
  }

  startEditing(request: any) {
    this.editingId = request.id;
    this.editableRequest = JSON.parse(JSON.stringify(request));

    setTimeout(() => {
      this.setupEditAutocomplete();
    }, 150);
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

    this.editingOriginInputs.first?.getInputElement().then(input => {
      const autocomplete = new google.maps.places.Autocomplete(input, options);
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place = autocomplete.getPlace();
          this.updateEditableAddress('origin', place);
        });
      });
    });

    this.editingDestinationInputs.first?.getInputElement().then(input => {
      const autocomplete = new google.maps.places.Autocomplete(input, options);
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place = autocomplete.getPlace();
          this.updateEditableAddress('destination', place);
        });
      });
    });
  }

  updateEditableAddress(type: 'origin' | 'destination', place: google.maps.places.PlaceResult) {
    if (!place.geometry || !place.formatted_address) return;
    
    const key = `${type}_address`;
    this.editableRequest[key] = {
      address: place.formatted_address,
      lat: place.geometry?.location?.lat() || null,
      lng: place.geometry?.location?.lng() || null
    };
    (this.editableRequest as any)[`${type}_components`] = place.address_components;
  }

  cancelEditing() {
    this.editingId = null;
    this.editableRequest = {};
  }

  async saveChanges() {
    const loading = await this.loadingCtrl.create({ message: 'Guardando...' });
    await loading.present();

    const { value: token } = await Preferences.get({ key: 'authToken' });
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    
    const dataToSend = {
      description: this.editableRequest.description,
      origin_address: this.editableRequest.origin_address.address,
      origin_lat: this.editableRequest.origin_address.lat,
      origin_lng: this.editableRequest.origin_address.lng,
      origin_components: (this.editableRequest as any).origin_components,
      
      destination_address: this.editableRequest.destination_address.address,
      destination_lat: this.editableRequest.destination_address.lat,
      destination_lng: this.editableRequest.destination_address.lng,
      destination_components: (this.editableRequest as any).destination_components,
    };

    this.http.put(`${this.apiUrl}/requests/${this.editingId}`, dataToSend, { headers, withCredentials: true }).subscribe({
      next: (updatedRequest: any) => {
        const index = this.requests.findIndex(r => r.id === this.editingId);
        if (index !== -1) {
          this.requests[index] = updatedRequest;
        }
        loading.dismiss();
        this.presentToast('Solicitud actualizada.', 'success');
        this.cancelEditing();
      },
      error: (err) => {
        loading.dismiss();
        console.error('Error al actualizar', err);
        this.presentToast('No se pudo actualizar la solicitud.', 'danger');
      }
    });
  }
  
  async confirmDelete(request: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de que deseas eliminar la solicitud #${request.id}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: () => this.deleteRequest(request.id) }
      ]
    });
    await alert.present();
  }
  
  async deleteRequest(id: number) {
    const loading = await this.loadingCtrl.create({ message: 'Eliminando...' });
    await loading.present();

    const { value: token } = await Preferences.get({ key: 'authToken' });
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.delete(`${this.apiUrl}/requests/${id}`, { headers, withCredentials: true }).subscribe({
      next: () => {
        this.requests = this.requests.filter(r => r.id !== id);
        loading.dismiss();
        this.presentToast('Solicitud eliminada.', 'success');
      },
      error: (err) => {
        loading.dismiss();
        console.error('Error al eliminar', err);
        this.presentToast('No se pudo eliminar la solicitud.', 'danger');
      }
    });
  }

  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color, position: 'top' });
    toast.present();
  }
}