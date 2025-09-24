import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonList, IonItem, IonInput, IonButton, IonContent, IonTitle,IonButtons,IonToolbar,IonBackButton, IonHeader,} from '@ionic/angular/standalone';
import { ApiService } from '../services/api';

declare const google: any;

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonList,
    IonItem,
    IonInput,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton
  ]
})
export class AddressPage implements AfterViewInit {
  address: any = {};
  map: any;
  marker: any;

  constructor(private apiService: ApiService) {}

  ngAfterViewInit() {
    this.initAutocompleteAndMap();
  }

  initAutocompleteAndMap() {
    // Check if the 'google' object is available
    if (typeof google !== 'undefined' && google.maps && google.maps.Map) {
      this.initializeMapAndAutocomplete();
    } else {
      // If the object is not available yet, wait 500ms and try again
      // This is a common and reliable pattern for asynchronous scripts.
      setTimeout(() => this.initAutocompleteAndMap(), 500);
    }
  }

  initializeMapAndAutocomplete() {
    const mapElement = document.getElementById('map');
    if (mapElement) {
        this.map = new google.maps.Map(mapElement, {
            center: { lat: -34.6037, lng: -58.3816 }, // Example: Buenos Aires
            zoom: 12
        });

        const input = document.getElementById('autocomplete-input') as HTMLInputElement;
        const autocomplete = new google.maps.places.Autocomplete(input);

        autocomplete.bindTo('bounds', this.map);

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();

            if (!place.geometry) {
                console.error("No se encontraron detalles para la dirección: '" + place.name + "'");
                return;
            }

            if (this.marker) {
                this.marker.setMap(null);
            }
            this.map.setCenter(place.geometry.location);
            this.map.setZoom(17);

            this.marker = new google.maps.Marker({
                map: this.map,
                position: place.geometry.location,
                draggable: true
            });
            
            this.address = this.extractAddressComponents(place);
            console.log(this.address);
        });
    }
  }

  private extractAddressComponents(place: any) {
    let components: any = {
      street: '',
      number: '',
      intersection: '',
      floor: '',
      department: '',
    };

    // Extract street name and number
    const streetComponent = place.address_components.find((comp: any) => comp.types.includes('route'));
    if (streetComponent) {
      components.street = streetComponent.long_name;
    }

    const numberComponent = place.address_components.find((comp: any) => comp.types.includes('street_number'));
    if (numberComponent) {
      components.number = numberComponent.long_name;
    }

    // Extract intersection
    const intersectionComponent = place.address_components.find((comp: any) => comp.types.includes('intersection'));
    if (intersectionComponent) {
      components.intersection = intersectionComponent.long_name;
    }

    // Extract sub-premise details like floor and department
    const floorComponent = place.address_components.find((comp: any) => comp.types.includes('floor'));
    if (floorComponent) {
      components.floor = floorComponent.long_name;
    }

    const departmentComponent = place.address_components.find((comp: any) => comp.types.includes('subpremise'));
    if (departmentComponent) {
      components.department = departmentComponent.long_name;
    }

    return components;
  }

  saveUserAddress() {
    console.log('Guardando dirección:', this.address);
    this.apiService.saveAddress(this.address).subscribe({
      next: (response) => {
        console.log('Dirección guardada con éxito', response);
      },
      error: (error) => {
        console.error('Error al guardar la dirección', error);
      }
    });
  }
}