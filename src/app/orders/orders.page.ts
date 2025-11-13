import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

// --- Imports Limpios ---
import { Global } from '../services/global';
import { ApiService } from '../services/api'; // <-- Ruta corregida
import { Order } from '../interfaces/interfaces'; // <-- Importamos la interfaz
import { HttpErrorResponse } from '@angular/common/http'; // <-- Importamos el tipo de error

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class OrdersPage implements OnInit {

  orders: Order[] = []; // <-- Usamos la Interfaz 'Order'
  isLoading = true;
  // 'apiUrl' y 'http' eliminados

  constructor(
    // 'http' ha sido eliminado
    private global: Global,
    private API: ApiService // Usamos el ApiService
  ) { }

  ngOnInit() {}

  async ionViewWillEnter() {
    this.loadOrders();
  }

  async loadOrders() {
    this.isLoading = true;
    const loading = await this.global.presentLoading('Cargando pedidos...');
    
    // --- ¡LÓGICA SIMPLIFICADA! ---
    // La página ya no sabe de 'tokens' o 'headers'.
    // Simplemente pide los datos al servicio.
    this.API.getUserOrders().subscribe({
      // Añadimos tipos a 'data' y 'err' para más seguridad
      next: (data: Order[]) => { 
        this.orders = data;
        this.isLoading = false;
        loading.dismiss();
      },
      error: (err: HttpErrorResponse) => { 
        console.error('Error al cargar pedidos', err);
        this.isLoading = false;
        loading.dismiss();
        this.global.presentToast('Error al cargar los pedidos.', 'danger');
      }
    });
  }
}