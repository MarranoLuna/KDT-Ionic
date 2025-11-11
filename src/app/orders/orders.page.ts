import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router'; // Importar RouterModule
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { Global } from '../services/global';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule] // Añadir RouterModule
})
export class OrdersPage implements OnInit {

  orders: any[] = [];
  isLoading = true;
  private apiUrl = 'https://kdtapp.openit.ar/api' // CORREGIR Y SEPARAR FUNCIONES Usar la URL del servicio

  constructor(
    private http: HttpClient, // Usaremos http directo si no tienes getOrders en ApiService
    private global: Global,
    private API: ApiService
  ) { }

  ngOnInit() {}

  async ionViewWillEnter() {
    this.loadOrders();
  }

  async loadOrders() {
    this.isLoading = true;
    const loading = await this.global.presentLoading('Cargando pedidos...');
    const { value: token } = await Preferences.get({ key: 'authToken' });
    if (!token) { 
      loading.dismiss(); 
      return; 
    }
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    
   
    const url = `${this.apiUrl}/user/my-orders`; 

    this.http.get<any[]>(url, { headers, withCredentials: true }).subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
        loading.dismiss();
      },
      error: (err) => {
        console.error('Error al cargar pedidos', err);
        this.isLoading = false;
        loading.dismiss();
        this.global.presentToast('Error al cargar los pedidos.', 'danger');
      }
    });
  }
}