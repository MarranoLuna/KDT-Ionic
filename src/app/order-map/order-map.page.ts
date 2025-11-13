import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButtons, IonBackButton 
} from '@ionic/angular/standalone';
import { Order } from '../interfaces/interfaces'; 

import { GoogleMapsModule, MapDirectionsService } from '@angular/google-maps';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-order-map',
  templateUrl: './order-map.page.html',
  styleUrls: ['./order-map.page.scss'],
  standalone: true,
  imports: [
    CommonModule,  FormsModule,  IonHeader,  IonToolbar,  IonTitle, IonContent, 
    IonButtons, IonBackButton,GoogleMapsModule ]
})
export class OrderMapPage implements OnInit {

  // Propiedades para el mapa
  mapCenter: google.maps.LatLngLiteral;
  mapZoom = 12;
  
  // Propiedades para la ruta
  origin: string = '';
  destination: string = '';
  travelMode = google.maps.TravelMode.DRIVING;

  // El "Observable" que guardará la respuesta de la API de Direcciones
  directionsResults$!: Observable<google.maps.DirectionsResult | undefined>;

  public backButtonUrl: string = '/kdt-home';

  constructor(
    private router: Router,
    private mapDirectionsService: MapDirectionsService
  ) {
    
    // recibe las direcciones de la página anterior
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      this.origin = nav.extras.state['originAddress'];
      this.destination = nav.extras.state['destinationAddress'];
    const orderId = nav.extras.state['orderId'];
      if (orderId) {
        // Creamos la URL de vuelta correcta (ej. /order-detail/8)
        this.backButtonUrl = `/order-detail/${orderId}`;
      }
    
    } else {
      // Si no hay datos, vuelve
      this.router.navigate(['/kdt-home']);
    }

    // centra el mapa (ej. en Gualeguaychú, o puedes usar el origen)
    this.mapCenter = { lat: -33.0094, lng: -58.5172 }; 
  }

  ngOnInit() {
    if (!this.origin || !this.destination) return;

    // prepara la solicitud para la API de Direcciones
    const request: google.maps.DirectionsRequest = {
      origin: this.origin,
      destination: this.destination,
      travelMode: this.travelMode,
    };

    // llama al servicio y guarda la respuesta en el Observable
    this.directionsResults$ = this.mapDirectionsService.route(request).pipe(
      map(response => response.result) // Mapea la respuesta para obtener solo el 'result'
    );
  }
}