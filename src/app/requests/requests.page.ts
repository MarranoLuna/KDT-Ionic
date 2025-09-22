import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api';
import { FormsModule } from '@angular/forms'; 

import {
  ToastController,
  AlertController
} from '@ionic/angular';

import {
  IonContent,  
  IonToolbar,  
  IonHeader, 
   IonButtons,
   IonBackButton,
   IonTitle, 
    IonCard,
    IonCardHeader,
  IonCardTitle,
   IonCardSubtitle, 
   IonCardContent, IonButton, 
   IonList, IonItem, 
   IonLabel, 
   IonTextarea, 
   IonInput,
   LoadingController
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
  standalone: true,
  imports: [
    CommonModule,FormsModule, IonContent,  IonToolbar,  IonHeader,  IonButtons,IonBackButton,IonTitle,  IonCard,IonCardHeader,
  IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonList, IonItem, IonTextarea, IonInput, IonLabel

  ]
})
export class RequestsPage implements OnInit {

  requests: any[] = [];
  expandedId: number | null = null;

  editingId: number | null = null;
  editableRequest: any = {};

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController, 
    private loadingCtrl: LoadingController,

  ) {}

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent'
    });
    await loading.present();
    await this.apiService.verifyLogin().then(() => loading.dismiss());

    this.getRequests();
  }


  getRequests() {
    this.http.get<any[]>('http://localhost:8000/api/requests').subscribe({
      next: (data) => {
        this.requests = data;
      },
      error: (err) => {
        console.error('Error al cargar solicitudes', err);
      }
    });
  }

  
  toggleDetail(id: number) {
    this.expandedId = this.expandedId === id ? null : id;
  }

  async confirmarEliminacion(request: any) {
    const alert = await this.alertCtrl.create({
      header: `Eliminar solicitud #${request.id}`,
      message: '¿Estás seguro de que deseas eliminar esta solicitud?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.eliminarSolicitud(request)
        }
      ]
    });

    await alert.present();
  }

  
  async eliminarSolicitud(request: any) {
    this.apiService.deleteRequest(request.id).subscribe({
      next: async () => {
        this.requests = this.requests.filter(r => r.id !== request.id);

        const toast = await this.toastCtrl.create({
          message: 'Solicitud eliminada con éxito',
          duration: 2000,
          color: 'success'
        });
        toast.present();
      },
      error: async (err) => {
        const toast = await this.toastCtrl.create({
          message: 'Error al eliminar solicitud',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
        console.error(err);
      }
    });
  }


  editarSolicitud(request: any) {
    this.editingId = request.id;
    this.editableRequest = { ...request };
  }

  cancelarEdicion() {
    this.editingId = null;
    this.editableRequest = {};
  }

  async guardarSolicitud() {
    try {
      const updated = await this.apiService.updateRequest(this.editableRequest).toPromise();

      const index = this.requests.findIndex(r => r.id === this.editingId);
      if (index !== -1) this.requests[index] = updated;

      this.editingId = null;
      this.editableRequest = {};

      const toast = await this.toastCtrl.create({
        message: 'Solicitud actualizada correctamente',
        duration: 2000,
        color: 'success'
      });
      toast.present();
    } catch (error) {
      console.error(error);
      const toast = await this.toastCtrl.create({
        message: 'Error al actualizar la solicitud',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }
}
