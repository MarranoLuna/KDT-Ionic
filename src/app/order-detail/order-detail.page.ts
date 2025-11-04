import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule,NavigationExtras } from '@angular/router'; 
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, 
  IonLabel, IonIcon, IonButton, IonBackButton, IonButtons, IonSpinner
} from '@ionic/angular/standalone';
import { ApiService } from '../services/api';
import { ToastController } from '@ionic/angular';

// --- Importaciones de tu 'orders.page.ts' ---
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { Global } from '../services/global'; 


@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, // Añade RouterModule
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, 
    IonItem, IonLabel, IonIcon, IonButton, IonBackButton, IonButtons, IonSpinner
  ]
})
export class OrderDetailPage implements OnInit {

  currentOrder: any = null; // Usamos 'any' como en tu 'orders.page'
  isCompleting: boolean = false;
  isLoading: boolean = true;
  private apiUrl = this.API.apiUrl; // Obtenemos la URL como en 'orders.page'

  constructor(
    private router: Router,
    private route: ActivatedRoute, // Para leer el ID de la URL
    private http: HttpClient,        // Como en 'orders.page'
    private global: Global,        // Como en 'orders.page'
    private API: ApiService,         // Para la apiUrl y 'completeOrder'
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    // Dejamos ngOnInit vacío, usaremos ionViewWillEnter
  }

  async ionViewWillEnter() {
    this.loadOrderDetail();
  }
  

  /**
   * Carga los detalles de la orden usando el mismo patrón que tu 'orders.page'
   */
  async loadOrderDetail() {
    this.isLoading = true;
    const loading = await this.global.presentLoading('Cargando pedido...');
    
    // 1. Lee el ID de la URL
    const orderId = this.route.snapshot.paramMap.get('id');
    if (!orderId) {
      console.error("No se encontró ID de orden");
      this.global.presentToast("Error: No se encontró ID de orden.", 'danger');
      loading.dismiss();
      this.router.navigate(['/kdt-home']);
      return;
    }

    // 2. Obtiene el token
    const { value: token } = await Preferences.get({ key: 'authToken' });
    if (!token) {
      this.global.presentToast("Error: No estás autenticado.", 'danger');
      loading.dismiss();
      this.router.navigate(['/login']);
      return;
    }

    // 3. Crea headers y llama a la API (usando http.get<any> como tú)
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    
    this.http.get<any>(`${this.apiUrl}/orders/${orderId}/details`, { headers }).subscribe({
      next: (data) => {
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
      error: (err) => {
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
      duration: 2500, // Le di un poco más de tiempo
      color: color,
      position: 'top'
    });
    toast.present();
  }
  
  verRecorrido() {
  if (!this.currentOrder) {
    this.presentToast('No se pueden cargar los detalles de la ruta', 'danger');
    return;
  }

  // 1. Extraemos las direcciones (el texto)
  const origen = this.currentOrder.offer.request.origin_address.address;
  const destino = this.currentOrder.offer.request.destination_address.address;

  // 2. Preparamos los datos para enviar
  const navigationExtras: NavigationExtras = {
    state: {
      originAddress: origen,
      destinationAddress: destino
    }
  };

  // 3. Navegamos a la nueva página del mapa
  this.router.navigate(['/order-map'], navigationExtras);
}

  /**
   * Lógica para completar el pedido (esta puede usar el ApiService)
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
      error: (err) => {
        loading.dismiss();
        this.global.presentToast("Error al completar el pedido", "danger");
        this.isCompleting = false;
      }
    });
  }
}
