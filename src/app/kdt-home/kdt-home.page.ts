import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GoogleMapsModule } from '@angular/google-maps';
import { Preferences } from '@capacitor/preferences';
import { RouterModule } from '@angular/router';
import { ApiService, } from '../services/api';
import { Global } from '../services/global';
import { ToastController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { KdtMenuComponent } from '../components/kdt-menu/kdt-menu.component';
import { ToggleStatusResponse, Order } from '../interfaces/interfaces';
import { Router, NavigationExtras } from '@angular/router';
import { lastValueFrom } from 'rxjs';



@Component({
  selector: 'app-kdt-home',
  templateUrl: './kdt-home.page.html',
  styleUrls: ['./kdt-home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, GoogleMapsModule, RouterModule, KdtMenuComponent]
})
export class KdtHomePage implements OnInit {

  userName: string = '';
  isKdtActive: boolean = true;
  courier: any;
  isToggling: boolean = false;
  currentOrder: Order | null = null;
  isLoadingOrder: boolean = true;
  private isFirstLoad: boolean = true;

  public availableRequestCount: number = 0;

  // Mapa
  mapCenter: google.maps.LatLngLiteral = { lat: -33.0078, lng: -58.5244 };
  mapZoom = 14;
  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true, // Quita controles del mapa
  };
  userLocation: google.maps.LatLngLiteral = { lat: -33.011, lng: -58.520 };
  activeRequests = [
    { id: 1, position: { lat: -33.005, lng: -58.530 } },
    { id: 2, position: { lat: -33.002, lng: -58.515 } },
  ];

  constructor(
    private apiService: ApiService,
    private toastCtrl: ToastController,
    private router: Router,
    private global: Global
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.loadUserData();
    this.loadActiveOrder();
  }



  async loadUserData() {
    const { value } = await Preferences.get({ key: 'user' });
    if (value) {
      const user = JSON.parse(value);

      this.userName = `${user.firstname || ''} ${''}`.trim();
      if (!this.userName) {
        this.userName = 'Usuario';
      }
    } else {
      this.userName = 'Usuario';
    }
  }

  // Llama a la API para ver si hay un pedido en curso
  loadActiveOrder() {
    // Solo mostramos el spinner la primera vez
    if (this.isFirstLoad) {
      this.isLoadingOrder = true;
    }

    this.apiService.getActiveOrder().subscribe({
      next: (order) => {
        this.currentOrder = order;
        this.isLoadingOrder = false; // Oculta el spinner
        this.isFirstLoad = false; // Marcamos que la primera carga ya pasó
      },
      error: (err) => {
        console.error("Error cargando pedido activo", err);
        this.isLoadingOrder = false; // Oculta el spinner en caso de error
        this.isFirstLoad = false;
      }
    });
  }

  // El botónpara refrescar
  handleRefresh(event: any) {
    this.apiService.getActiveOrder().subscribe({
      next: (order) => {
        this.currentOrder = order;
        event.target.complete(); // Le dice al <ion-refresher> que termine
      },
      error: (err) => {
        this.global.presentToast("Error al refrescar", "danger");
        event.target.complete(); // También debe terminar si hay error
      }
    });
  }

  goToActiveOrder() {
    if (this.currentOrder && this.currentOrder.id) {

      this.router.navigate(['/order-detail', this.currentOrder.id]);

    } else {

      // Esto solo pasaría si la API devuelve algo raro.
      console.error("Se intentó navegar, pero currentOrder no tiene un ID:", this.currentOrder);
      this.global.presentToast("No se pudo cargar el pedido. Intenta refrescar.", "danger");

      this.loadActiveOrder();
    }
  }


  toggleStatus() {
    // evita clics múltiples si ya está cargando
    if (this.isToggling) {
      return;
    }
    this.isToggling = true;

    const previousState = this.isKdtActive;
    this.isKdtActive = !this.isKdtActive; // Actualización optimista de la UI
    console.log('Estado KDT cambiado a:', this.isKdtActive ? 'Activo' : 'Inactivo');

    this.apiService.toggleCourierStatus().subscribe({


      next: (response: ToggleStatusResponse) => {
        this.isKdtActive = response.new_status;
        this.isToggling = false;

        const message = response.new_status ? 'Ahora puedes completar pedidos' : 'Estás INACTIVO';
        this.global.presentToast(message, 'success');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cambiar el estado', err);
        this.isKdtActive = previousState;
        this.isToggling = false;
        this.global.presentToast('Error al cambiar tu estado. Intenta de nuevo.', 'danger');
      }
    });
  }

  // Tu función helper de Toast
  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    toast.present();
  }


  async loadDashboardData(event: any | null) {
    // Si es la carga inicial (no un refresco), muestra el spinner
    if (!event) {
      this.isLoadingOrder = true;
    }

    try {
      // Llama a ambas APIs al mismo tiempo y espera a que las dos terminen
      const [order, requestData] = await Promise.all([
        lastValueFrom(this.apiService.getActiveOrder()),
        lastValueFrom(this.apiService.getAvailableRequestsCount())
      ]);

      // Asigna los resultados
      this.currentOrder = order;
      this.availableRequestCount = requestData.available_count;

    } catch (err) {
      console.error("Error cargando datos del dashboard", err);
      this.global.presentToast("Error al refrescar los datos", "danger");
    } finally {
      // Pase lo que pase, oculta el spinner y/o el refresher
      this.isLoadingOrder = false;
      if (event) {
        event.target.complete();
      }
    }
  }
}