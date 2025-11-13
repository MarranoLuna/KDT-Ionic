import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule, NavigationExtras } from '@angular/router'; 
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, 
  IonLabel, IonIcon, IonButton, IonBackButton, IonButtons, IonSpinner
} from '@ionic/angular/standalone';

// --- Imports de Servicios y Errores ---
import { ApiService } from '../services/api'; 
import { Global } from '../services/global'; 
import { Order } from '../interfaces/interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastController } from '@ionic/angular'; 

@Component({
 selector: 'app-order-detail',
 templateUrl: './order-detail.page.html',
 styleUrls: ['./order-detail.page.scss'],
 standalone: true,
 imports: [
 CommonModule, FormsModule, RouterModule, 
 IonHeader, IonToolbar, IonTitle, IonContent, IonList, 
 IonItem, IonLabel, IonIcon, IonButton, IonBackButton, IonButtons, IonSpinner
 ]
})
export class OrderDetailPage implements OnInit {

 currentOrder: Order | null = null;
 isCompleting: boolean = false;
 isLoading: boolean = true;

 constructor(
 private router: Router,
 private route: ActivatedRoute, 
 private global: Global, 
 private API: ApiService, 
 private toastCtrl: ToastController 
 ) {}

 ngOnInit() { } 

 async ionViewWillEnter() {
 this.loadOrderDetail();
 }
 
  /**
   * Carga los detalles de la orden usando el ApiService.
   */
 async loadOrderDetail() {
 this.isLoading = true;
 const loading = await this.global.presentLoading('Cargando pedido...');
 
 const orderId = this.route.snapshot.paramMap.get('id');
 if (!orderId) {
      loading.dismiss();
      console.error("No se encontró ID de orden");
      this.global.presentToast("Error: No se encontró ID de orden.", 'danger');
  this.router.navigate(['/kdt-home']);
 return;
 }

 this.API.getOrderDetail(orderId).subscribe({
 next: (data: Order) => {
 if (data) {
this.currentOrder = data;
console.log('Datos completos del pedido cargados:', this.currentOrder);
 } else {
this.global.presentToast("No se encontraron datos para este pedido.", 'warning');
 this.router.navigate(['/kdt-home']);
 }
 this.isLoading = false;
 loading.dismiss();
 },
 error: (err: HttpErrorResponse) => {
 console.error('Error al cargar detalles del pedido', err);
 this.isLoading = false;
 loading.dismiss();
 this.global.presentToast('Error al cargar los detalles.', 'danger');
 this.router.navigate(['/kdt-home']);
}
 });
 } 

  
 async presentToast(message: string, color: 'success' | 'danger' | 'warning') {
 const toast = await this.toastCtrl.create({
 message: message,
 duration: 2500,
 color: color,
 position: 'top'
 });
 toast.present();
 }
 
  /**
   * Navega a la página del mapa
   */

 verRecorrido() {
    

   if (!this.currentOrder || !this.currentOrder.offer || !this.currentOrder.offer.request) {
   this.presentToast('No se pueden cargar los detalles de la ruta', 'danger');
   return;
   }

   const origen = this.currentOrder.offer.request.origin_address?.address; 
   const destino = this.currentOrder.offer.request.destination_address?.address;

    if (!origen || !destino) {
      this.presentToast('Las direcciones de origen o destino no están disponibles.', 'warning');
      return;
    }


 const navigationExtras: NavigationExtras = { 
   state: {
   originAddress: origen,
   destinationAddress: destino
   }
   };

   this.router.navigate(['/order-map'], navigationExtras);
  }

  /**
   * Lógica para completar el pedido
   */
 async completeOrder() {
 if (this.isCompleting || !this.currentOrder) return;

 this.isCompleting = true;
 const loading = await this.global.presentLoading('Completando pedido...');
 
 this.API.completeOrder(this.currentOrder.id).subscribe({
 next: () => {
 loading.dismiss();
 this.global.presentToast("¡Pedido completado!", "success");
 this.isCompleting = false;
 this.router.navigate(['/kdt-home']);
 },
  error: (err: HttpErrorResponse) => { 
    loading.dismiss();
this.global.presentToast("Error al completar el pedido", "danger");
 this.isCompleting = false; 
 }
 });
 }
}