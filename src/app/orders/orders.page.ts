import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Global } from '../services/global';
import { ApiService } from '../services/api'; 
import { Order } from '../interfaces/interfaces'; 
import { HttpErrorResponse } from '@angular/common/http'; 

@Component({
selector: 'app-orders',
templateUrl: './orders.page.html',
styleUrls: ['./orders.page.scss'],
standalone: true,
imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class OrdersPage implements OnInit {

orders: Order[] = []; 
isLoading = true;


constructor(
private global: Global,
private API: ApiService 
) { }

ngOnInit() {}

async ionViewWillEnter() {
this.loadOrders();
}

async loadOrders() {
this.isLoading = true;
const loading = await this.global.presentLoading('Cargando pedidos...');

this.API.getUserOrders().subscribe({
next: (data: Order[]) => { 
  // --- CAMBIO AQUÍ ---
  // En lugar de asignar 'data' directamente, la pasamos por la función de ordenamiento
 this.orders = this.sortOrdersByStatus(data);
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


  private sortOrdersByStatus(orders: Order[]): Order[] {

    const estadoCompletado = 'Completada'; 

    return orders.sort((a, b) => {
      // 1. Lógica de Estado (Prioridad 1)
      // Asigna 0 si NO está completada, 1 si SÍ lo está.
      const aValue = a.status?.name === estadoCompletado ? 1 : 0;
      const bValue = b.status?.name === estadoCompletado ? 1 : 0;

      const estadoSort = aValue - bValue;

      // Si los estados son diferentes (uno es 0 y el otro 1), usamos ese orden.
      if (estadoSort !== 0) {
        return estadoSort;
      }

      // 2. Lógica de Fecha (Prioridad 2)
      // Si ambos tienen el mismo estado (ambos 0 o ambos 1),
      // los ordenamos por fecha más reciente primero (descendente).
      const dateA = new Date(a.updated_at).getTime();
      const dateB = new Date(b.updated_at).getTime();
      
      return dateB - dateA; // (b - a) para orden descendente (más nuevo arriba)
    });
  }
}