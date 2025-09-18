/*
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClient } from '@angular/common/http';
import { IonContent, IonHeader,IonTitle, IonToolbar, IonItem, IonBackButton, IonButtons, IonButton} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./addrdess.page.scss'],
  standalone: true,
  imports: [RouterModule, HttpClientModule,  
  CommonModule, FormsModule,GoogleMapsModule, IonContent, IonHeader,IonTitle,
  IonToolbar, IonItem, IonBackButton, IonButtons, IonButton]
})
export class AddressPage implements OnInit {

  center: google.maps.LatLngLiteral = { lat: -33.00777, lng: -58.51836 }; 
  marker: google.maps.LatLngLiteral | null = null;
  search: string = '';

  constructor(private http: HttpClient) {}

  seleccionarDireccion(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.marker = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
    }
  }

  buscarDireccion() {
    if (this.search.length > 3) {
      const apiKey = 'AIzaSyBSdr-1bVaRWRDsiiJYizyKcapHgaeTpGQ'; 
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${this.search}&key=${apiKey}`;

      this.http.get(url).subscribe((res: any) => {
        if (res.results.length > 0) {
          const location = res.results[0].geometry.location;
          this.center = { lat: location.lat, lng: location.lng };
          this.marker = { lat: location.lat, lng: location.lng };
        }
      });
    }
  }

  guardarDireccion() {
    if (!this.marker) return;

    const data = {
      street: this.search,
      number: '', // podrías parsear res.results[0].address_components
      latitude: this.marker.lat,
      longitude: this.marker.lng
    };

    this.http.post('http://localhost:8000/api/addresses', data).subscribe({
      next: res => console.log('Dirección guardada', res),
      error: err => console.error('Error guardando dirección', err)
    });
  }


  ngOnInit() {
    if (!(window as any).google) {
    const check = setInterval(() => {
      if ((window as any).google) {
        clearInterval(check);
        this.center = { lat: -33.00777, lng: -58.51836 };
      }
    }, 500);
  }
  }

}




*/ 