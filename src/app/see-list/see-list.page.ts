import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Global } from 'src/app/services/global';
import { ApiService } from '../services/api'; 
import { Request } from '../interfaces/interfaces'; 
import { HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-see-list',
  templateUrl: './see-list.page.html',
  styleUrls: ['./see-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class SeeListPage implements OnInit {

  availableRequests: Request[] = []; //interfaz 
  isLoading = true;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private global: Global,
    private apiService: ApiService 
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.loadAvailableRequests();
  }

  async loadAvailableRequests() {
    this.isLoading = true;
    
    this.apiService.getAvailableRequests().subscribe({
      next: (data: Request[]) => {
        this.availableRequests = data;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar solicitudes disponibles', err);
        this.isLoading = false;
        this.presentToast('No se pudieron cargar las solicitudes.', 'danger');
      }
    });
  }

  
  async makeOffer(request: Request) { 
    const alert = await this.alertCtrl.create({
      header: 'Ingresá tu Oferta',
      message: `¿Cuánto querés cobrar por la solicitud #${request.id}?`,
      inputs: [
        {
          name: 'price',
          type: 'number',
          placeholder: 'Ej: 500',
          min: 0,
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Ofertar',
          handler: async (data) => {
            if (!data.price || data.price <= 0) {
              this.presentToast('Por favor, ingresá un precio válido.', 'danger');
              return false; 
            }

      
            try {
              
              await this.sendOfferToApi(request, data.price);
              
              request.has_offered = true; 
              this.presentToast('¡Oferta enviada con éxito!', 'success');
              
              return true; 

            } catch (error) {
             
              console.error('Error al enviar la oferta', error);
              
              let message = 'No se pudo enviar la oferta.';
              
              if (error instanceof HttpErrorResponse) {
                if (error.status === 409) { 
                  message = error.error.message || 'Ya has enviado una oferta.';
                  request.has_offered = true; 
                } else if (error.error && error.error.message) {
                  message = error.error.message;
                }
              }
              
              this.presentToast(message, 'danger');
              return false; 
            }
          }
        }
      ]
    });
    await alert.present();
  }

  //envía la oferta al ApiService
   
  async sendOfferToApi(request: Request, price: number) {
    const loading = await this.loadingCtrl.create({ message: 'Enviando oferta...' });
    await loading.present();

    try {
      const offer = await lastValueFrom(
        this.apiService.makeOffer(request.id, price)
      );
      
      loading.dismiss();
      this.global.recargarPagina(); 
      return offer;

    } catch (err) { 
      loading.dismiss();
      console.error('Error en la llamada API de sendOfferToApi', err);
      throw err; 
    }
  }

  
  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color, position: 'top' });
    await toast.present();
  }
}