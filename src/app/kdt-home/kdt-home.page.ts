import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GoogleMapsModule } from '@angular/google-maps';
import { Preferences } from '@capacitor/preferences';
import { RouterModule } from '@angular/router';
import { ApiService, } from '../services/api';
import { ToastController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { MenuComponent } from '../menu/menu.component';
import {  ToggleStatusResponse, Order } from '../interfaces/interfaces';
import { Router, NavigationExtras } from '@angular/router';



@Component({
  selector: 'app-kdt-home',
  templateUrl: './kdt-home.page.html',
  styleUrls: ['./kdt-home.page.scss'],
  standalone: true,
  imports: [IonicModule,CommonModule, FormsModule, GoogleMapsModule, RouterModule, MenuComponent]
})
export class KdtHomePage implements OnInit {

  userName: string = '';
  isKdtActive: boolean = true;
  courier: any;
  isToggling: boolean = false;
  currentOrder: Order | null = null;
  isLoadingOrder: boolean = true;

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
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.loadUserData();
    this.loadActiveOrder();
  }

async loadUserData() {
  const { value } = await Preferences.get({ key: 'user' });
  if (value) {
    const user = JSON.parse(value);
   
    this.userName = `${user.firstname || ''} ${  ''}`.trim();
    if (!this.userName) {
        this.userName = 'Usuario'; 
    }
  } else {
      this.userName = 'Usuario'; 
  }
}

// Llama a la API para ver si hay un pedido en curso
  loadActiveOrder() {
    this.isLoadingOrder = true;
    this.apiService.getActiveOrder().subscribe({
      next: (order) => {
        this.currentOrder = order; // 'order' será el objeto del pedido o 'null'
        this.isLoadingOrder = false;
        console.log('Pedido activo cargado:', this.currentOrder);
      },
      error: (err) => {
        console.error("Error cargando pedido activo", err);
        this.isLoadingOrder = false;
        this.presentToast("Error al cargar tu pedido", "danger");
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
        this.presentToast("Error al refrescar", "danger");
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
      this.presentToast("No se pudo cargar el pedido. Intenta refrescar.", "danger");
      
      this.loadActiveOrder(); 
    }
}


toggleStatus() {
    // 1. Previene clics múltiples si ya está cargando
    if (this.isToggling) {
      return; 
    }
    this.isToggling = true; 

    const previousState = this.isKdtActive;
    this.isKdtActive = !this.isKdtActive; // Actualización optimista de la UI
    console.log('Estado KDT cambiado a:', this.isKdtActive ? 'Activo' : 'Inactivo');

    // 2. Llama a la función que AHORA SÍ EXISTE en ApiService
    this.apiService.toggleCourierStatus().subscribe({
      
      // 3. --- ARREGLADO: Añadidos los tipos 'response' y 'err' ---
      next: (response: ToggleStatusResponse) => { 
        this.isKdtActive = response.new_status; // Sincroniza con el estado real del backend
        this.isToggling = false;
        
        const message = response.new_status ? 'Ahora estás ACTIVO' : 'Ahora estás INACTIVO';
        this.presentToast(message, 'success');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cambiar el estado', err);
        // 4. Revertimos el cambio si la API falla
        this.isKdtActive = previousState; 
        this.isToggling = false;
        this.presentToast('Error al cambiar tu estado. Intenta de nuevo.', 'danger');
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

}