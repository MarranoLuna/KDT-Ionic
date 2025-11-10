import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, 
  IonLabel, IonBackButton, IonButtons, IonSpinner,  IonCard, IonCardContent 
} from '@ionic/angular/standalone';
import { Order, EarningsResponse } from '../interfaces/interfaces';
import { ApiService } from '../services/api';
import { ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-kdt-earnings',
  templateUrl: './kdt-earnings.page.html',
  styleUrls: ['./kdt-earnings.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, DatePipe,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, 
    IonBackButton, IonButtons, IonSpinner,
    IonCard, IonCardContent
  ]
})
export class KdtEarningsPage implements OnInit {

  
  completedOrders: Order[] = [];
  totalEarnings: number = 0;
  isLoading: boolean = true;

  constructor(
    private apiService: ApiService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadEarnings();
  }

  loadEarnings() {
    this.isLoading = true;
    this.apiService.getEarnings().subscribe({
      next: (data: EarningsResponse) => {
        this.completedOrders = data.completed_orders;
        this.totalEarnings = data.total_earnings;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando ganancias', err);
        this.isLoading = false;
        this.presentToast('Error al cargar tus ganancias', 'danger');
      }
    });
  }

  async presentToast(message: string, color: 'danger') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    toast.present();
  }
}