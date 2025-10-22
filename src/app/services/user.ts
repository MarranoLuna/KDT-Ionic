import { Injectable } from '@angular/core';
import { UserData } from './api'; 
import { Observable } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
import { ApiService } from './api';
import { tap } from 'rxjs/operators';
import { LoginResponse } from '../interfaces/interfaces';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
        private apiService: ApiService, // Inyectamos ApiService
        private router: Router
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
}



