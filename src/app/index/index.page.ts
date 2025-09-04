
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; 
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
  ]
})

export class IndexPage {

  constructor(private apiService: ApiService) {}


  async probarApi() {
    try {
      const response = await firstValueFrom(this.apiService.getPosts());
      console.log('Respuesta de la API:', response);
      // Aquí puedes mostrar la respuesta en pantalla si lo deseas
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  }

}

