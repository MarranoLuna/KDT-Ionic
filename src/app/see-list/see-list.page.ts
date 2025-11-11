import { Component, OnInit, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { RouterModule } from '@angular/router';
import { Global } from 'src/app/services/global';


@Component({
  selector: 'app-see-list',
  templateUrl: './see-list.page.html',
  styleUrls: ['./see-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class SeeListPage implements OnInit {

  availableRequests: any[] = [];
  isLoading = true;
  private apiUrl = 'https://kdtapp.openit.ar/api'; /// cambiar para usar API
  //private apiUrl = 'http://localhost:8000/api'
  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private global: Global,
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.loadAvailableRequests();
  }

  async loadAvailableRequests() {
    this.isLoading = true;
    const { value: token } = await Preferences.get({ key: 'authToken' });
    if (!token) {
      this.isLoading = false;
      return;
    }
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<any[]>(`${this.apiUrl}/requests/available`, { headers, withCredentials: true }).subscribe({
      next: (data) => {
        this.availableRequests = data; // Ya no hay que filtrar
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar solicitudes disponibles', err);
        this.isLoading = false;
        this.presentToast('No se pudieron cargar las solicitudes.', 'danger');
      }
    });
  }

  async makeOffer(request: any) {
    const alert = await this.alertCtrl.create({
      header: 'Ingresá tu Oferta',
      message: `¿Cuánto querés cobrar por la solicitud #${request.id}?`,
      inputs: [
        {
          name: 'price',
          type: 'number',
          placeholder: 'Ej: 500',
          min: 0, // No permitir precios negativos
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Ofertar',
          handler: async (data) => {
            // Validamos que se haya ingresado un precio
            if (!data.price || data.price <= 0) {
              this.presentToast('Por favor, ingresá un precio válido.', 'danger');
              return false; // Evita que se cierre el alert
            }

            // Si el precio es válido, llamamos a la API
            await this.sendOfferToApi(request.id, data.price);
            return true; // Cierra el alert
          }
        }
      ]
    });
    await alert.present();

  }

  async sendOfferToApi(requestId: number, price: number) {
    const loading = await this.loadingCtrl.create({ message: 'Enviando oferta...' });
    await loading.present();

    const { value: token } = await Preferences.get({ key: 'authToken' });
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const body = { price: price }; // El cuerpo de la petición solo necesita el precio

    this.http.post(`${this.apiUrl}/requests/${requestId}/make_offer`, body, { headers, withCredentials: true }).subscribe({
      next: (offer) => {
        loading.dismiss();
        this.presentToast('¡Oferta enviada con éxito!', 'success');
        const requestIndex = this.availableRequests.findIndex(req => req.id === requestId);
        if (requestIndex !== -1) {
          // Le agregamos una propiedad para saber que ya ofertamos
          this.availableRequests[requestIndex].has_offered = true;
        }
      },


      error: (err) => {
        loading.dismiss();
        console.error('Error al enviar la oferta', err);
        const message = err.error?.message || 'No se pudo enviar la oferta.';
        this.presentToast(message, 'danger');
      }
    });
  }

  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color, position: 'top' });
    await toast.present();
  }
}
