import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, 
  IonLabel, IonBackButton, IonButtons, IonSpinner,  IonCard, IonCardContent,
  IonSegment, IonSegmentButton} from '@ionic/angular/standalone';
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
    IonCard, IonCardContent, IonSegment, IonSegmentButton
  ]
})
export class KdtEarningsPage implements OnInit {

  
  completedOrders: Order[] = [];
  totalEarnings: number = 0;
  isLoading: boolean = true;
  currentFilter: 'today' | 'total' = 'today';

  constructor(
    private apiService: ApiService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadEarnings();
  }

  loadEarnings() {
    this.isLoading = true;
    // Usa la variable 'currentFilter' para la llamada
    this.apiService.getEarnings(this.currentFilter).subscribe({
      next: (data: EarningsResponse) => {
        this.completedOrders = data.completed_orders;
        this.totalEarnings = data.total_earnings;
        this.isLoading = false;
      },
      error: (err) => {
        // ... (tu manejo de error) ...
      }
    });
  }

  onFilterChange(event: any) {
    // otiene el nuevo valor ('today' o 'total')
    this.currentFilter = event.detail.value;
    // vuelve a cargar los datos con el nuevo filtro
    this.loadEarnings();
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