import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonContent,IonHeader,IonTitle,IonToolbar, IonButtons, IonBackButton,LoadingController , 
    IonItem, IonLabel, IonSpinner,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent
} from '@ionic/angular/standalone';
import { Global } from '../services/global';
import { Order } from '../interfaces/interfaces'; // Importa tu interfaz
import { ApiService } from '../services/api';
import { ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router'
@Component({
  selector: 'app-kdt-historial',
  templateUrl: './kdt-historial.page.html',
  styleUrls: ['./kdt-historial.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader,IonTitle,IonToolbar,IonButtons,
    CommonModule,IonBackButton,FormsModule 
   , IonToolbar, IonTitle, IonContent, IonItem, IonLabel,  IonBackButton, IonButtons, IonSpinner,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent]
})
export class KdtHistorialPage implements OnInit {

  orderHistory: Order[] = []; 
  isLoading: boolean = true;

  constructor(
    private apiService: ApiService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.isLoading = true;
    this.apiService.getOrderHistory().subscribe({
      next: (data) => {
        this.orderHistory = data; // <-- ¡ARREGLADO!
        this.isLoading = false;
        console.log('Historial cargado:', this.orderHistory); // <-- ¡ARREGLADO!
      },
      error: (err) => {
        console.error('Error cargando historial', err);
        this.isLoading = false;
        this.presentToast('Error al cargar el historial', 'danger');
      }
    });
  }

  // Helper de Toast
  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    toast.present();
  }
}
