import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ApiService } from '../services/api';
import { Global } from '../services/global';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-kdt-vehicle',
  templateUrl: './kdt-vehicle.page.html',
  styleUrls: ['./kdt-vehicle.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonicModule
  ]
})
export class KdtVehiclePage implements OnInit {
  vehicles: any[] = [];

  constructor(
    private API: ApiService,
    private global: Global,
    private router:Router
  ) { }

  async ngOnInit() {
    this.showVehicles();
  }
  

  async showVehicles() {
    const loading = await this.global.presentLoading("Cargando vehículos...");

    (await this.API.getVehicles()).subscribe({ // envía los datos a través de la función getVehicles de la API
      next: async (data: any) => {
        // guardo datos o algo
        console.log("llegaron los vehículos");
        console.log(data);
        this.vehicles = data; // guardo los vehículos en la variable
        loading.dismiss(); //quito el loading
      },
      error: (err: any) => {
        console.error('Error al cargar solicitudes', err);
        loading.dismiss();
        this.global.presentToast('Error al cargar las solicitudes.', 'danger');
      }
    });

  }

  select_vehicle(vehicle: any) {
    this.global.presentInputAlert(
      "Seleccionar Vehículo",
      `Seleccionar ${vehicle.vehicle_type.name} ${vehicle.motorcycle_brand?.name || vehicle.bicycle_brand?.name} ${vehicle.model} como vehículo en uso?`,
      [],
      async () => {
        const isLoading = await this.global.presentLoading("Actualizando...");
        (await this.API.changeVehicle(vehicle.id)).subscribe({
          next: () => {
            isLoading.dismiss();
            this.global.recargarPagina();
          },
          error: (err: any) => {
            console.error('Error al cambiar de vehículo', err);
            isLoading.dismiss();
            this.global.presentToast('Error al cambiar de vehículo', 'danger');
          }

        })

      }
    );
  }


  edit_vehicle(vehicle: any) {
    console.log("Modificar / eliminar vehículo: " + vehicle.registration_plate);
    this.global.presentInputAlert(
      "Eliminar Vehículo",
      `Eliminar ${vehicle.vehicle_type.name} ${vehicle.motorcycle_brand?.name || vehicle.bicycle_brand?.name} ${vehicle.model} de sus vehículos?`,
      [],
      async () => {
        const isLoading = await this.global.presentLoading("Actualizando...");
        (await this.API.deleteVehicle(vehicle.id)).subscribe({
          next: () => {
            isLoading.dismiss();
            this.global.recargarPagina();
          },
          error: (err: any) => {
            isLoading.dismiss();
            this.global.presentToast('Error al eliminar el vehículo', 'danger');
          }

        })

      }
    );
  }

  new_vehicle() {
    console.log("Registrar vehículo nuevo")
  }


}
