import { Injectable } from '@angular/core';
import { UserData } from './api'; 
import { Observable } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
import { ApiService } from './api';
import { tap } from 'rxjs/operators';
import { LoginResponse } from '../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { from} from 'rxjs'; 
import { switchMap } from 'rxjs/operators'; 
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {

    public apiUrl = 'https://kdtapp.openit.ar/api';
  private COURIER_ID_KEY = 'courier_id'; 
  private currentUser: any = null;
  

  constructor(
        private apiService: ApiService, // Inyectamos ApiService
        private router: Router,
        private http: HttpClient
    ) { }


    login(credentials: any): Observable<LoginResponse> {
        return this.apiService.login(credentials).pipe(
            tap(async (res) => {
                if (res.token && res.user) {
                    // Guarda el token y el usuario en Preferences
                    await Preferences.set({ key: 'authToken', value: res.token });
                    await this.saveUser(res.user); // Usamos nuestro propio método para guardar
                    
                    // Redirige a home
                    this.router.navigate(['/home']);
                }
            })
        );
    }

    async logout(): Promise<void> {
        await Preferences.remove({ key: 'user' });
        await Preferences.remove({ key: 'authToken' });
        this.router.navigate(['/login']);
    }

    // Verifica si el usuario está logueado y redirige si no lo está
    async verifyLogin(): Promise<void> {
        const { value } = await Preferences.get({ key: 'authToken' });
        if (!value) {
            this.router.navigate(['/login']);
        }
    }

    // devuelve si hay un token o no (útil para guardas de ruta)
    async isAuthenticated(): Promise<boolean> {
        const { value } = await Preferences.get({ key: 'authToken' });
        return value !== null;
    }

    // --- Métodos para manejar datos locales del usuario ---
    public async saveUser(user: UserData): Promise<void> {
        await Preferences.set({ key: 'user', value: JSON.stringify(user) });
    }

    public async getCurrentUser(): Promise<UserData | null> {
        const { value } = await Preferences.get({ key: 'user' });
        if (value) {
            try {
                return JSON.parse(value) as UserData;
            } catch (e) {
                console.error('Error al parsear los datos del usuario:', e);
                return null;
            }
        }
        return null;
    }

    public async setCourierId(id: number) {
      await Preferences.set({
      key: this.COURIER_ID_KEY,
      value: id.toString() // Lo guardamos como string
      });
      console.log('Courier ID guardado en Preferences:', id);
    }

    public async getCourierId(): Promise<number | null> {
      const { value } = await Preferences.get({ key: this.COURIER_ID_KEY });
          console.log('Buscando ID del courier. Valor encontrado:', value); 
      if (value) {
      return parseInt(value, 10); 
      }
      return null;
    }


    public async hasCourierApplication(): Promise<boolean> {
  
        // 1. Leemos al usuario desde el almacenamiento (Preferences)
        const user = await this.getCurrentUser(); 

        // 2. Comprobamos si el usuario y la relación 'courier' existen
        if (user && user.courier) {
            // Si 'user' existe Y 'user.courier' no es null,
            // significa que ya tiene un registro de cadete.
            return true;
        }
    
        return false;
    }

   registerBicycle(data: { color: string, brand_id: number }): Observable<any> {
    
    // 1. Obtiene el token
    return from(Preferences.get({ key: 'authToken' })).pipe(
      
      // 2. Usa switchMap para "cambiar" a la llamada HTTP
      switchMap(tokenData => {
        if (!tokenData.value) {
          throw new Error('Token de autenticación no encontrado.');
        }

        // 3. Crea las cabeceras (headers)
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${tokenData.value}`,
          'Accept': 'application/json'
        });

        // 4. Llama a la API con los datos Y las cabeceras
        return this.http.post(`${this.apiUrl}/vehicles/register-bicycle`, data, { headers });
      })
    );
  }

  registerMotorcycle(data: { 
    model: string, 
    color: string, 
    registration_plate: string, 
    brand_id: number 
  }): Observable<any> {

    // 1. Obtiene el token
    return from(Preferences.get({ key: 'authToken' })).pipe(
      
      // 2. Usa switchMap
      switchMap(tokenData => {
        if (!tokenData.value) {
          throw new Error('Token de autenticación no encontrado.');
        }

        // 3. Crea las cabeceras
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${tokenData.value}`,
          'Accept': 'application/json'
        });

        // 4. Llama a la API con los datos Y las cabeceras
        return this.http.post(`${this.apiUrl}/vehicles/register-motorcycle`, data, { headers });
      })
    );
  }

  }