import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GoogleMapsModule } from '@angular/google-maps';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-kdt-home',
  templateUrl: './kdt-home.page.html',
  styleUrls: ['./kdt-home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, GoogleMapsModule]
})
export class KdtHomePage implements OnInit {

  userName: string = '';
  isKdtActive: boolean = true;

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

  constructor() { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.loadUserData();
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


  toggleStatus() {
    this.isKdtActive = !this.isKdtActive;
    console.log('Estado KDT:', this.isKdtActive ? 'Activo' : 'Inactivo');
    // Futuro: Llamar API para guardar estado
  }
}