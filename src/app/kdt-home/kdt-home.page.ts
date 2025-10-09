import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GoogleMapsModule } from '@angular/google-maps';


@Component({
  selector: 'app-kdt-home',
  templateUrl: './kdt-home.page.html',
  styleUrls: ['./kdt-home.page.scss'],
  standalone: true,
  imports: [ IonicModule, CommonModule, FormsModule,GoogleMapsModule]
})
export class KdtHomePage implements OnInit {
// --- LÓGICA DE MAPA (sin cambios) ---
  mapCenter: google.maps.LatLngLiteral = { lat: -33.0078, lng: -58.5244 };
  mapZoom = 14;
  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
  };
  userLocation: google.maps.LatLngLiteral = { lat: -33.011, lng: -58.520 };
  activeRequests = [
    { id: 1, position: { lat: -33.005, lng: -58.530 } },
    { id: 2, position: { lat: -33.002, lng: -58.515 } },
  ];

  // --- NUEVA PROPIEDAD Y FUNCIÓN ---
  isKdtActive = true; // Variable para controlar el estado

  constructor() { }

  ngOnInit() {
  }

  // Función para cambiar el estado al hacer clic
  toggleStatus() {
    this.isKdtActive = !this.isKdtActive;
    console.log('Estado del KDT cambiado a:', this.isKdtActive ? 'Activo' : 'Inactivo');
    // En el futuro, aquí harías una llamada a tu API para guardar el estado en el backend.
  }

}