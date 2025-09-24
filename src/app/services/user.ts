import { Injectable } from '@angular/core';
import { UserData } from './api'; 
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://api.tu-dominio.com/api';

  constructor(private http: HttpClient) { }

  /**
   * Envía la petición para cambiar la contraseña del usuario.
   * @param passwordData Objeto con { currentPassword, newPassword }
   * @returns Observable con la respuesta del servidor.
    */

  // Guarda los datos del usuario en localStorage después del login
  public saveUser(user: UserData): void {
    window.localStorage.removeItem('current_user'); // Limpia el anterior
    window.localStorage.setItem('current_user', JSON.stringify(user));
  }

  // Obtiene el ID del usuario guardado
  public getCurrentUserId(): number | null {
    const userString = window.localStorage.getItem('current_user');
    if (userString) {
      const user: UserData = JSON.parse(userString);
      return user.id ?? null; 
    }
    return null;
  }

  // Limpia los datos al cerrar sesión
  public logout(): void {
    window.localStorage.removeItem('current_user');
  }
  
  public getCurrentUserName(): string {
    const userString = window.localStorage.getItem('current_user');
    if (userString) {
      const user: UserData = JSON.parse(userString);
      return user.firstname || ''; 
    }
    return '';
  }

  changePassword(passwordData: any): Observable<any> {
 
    const token = localStorage.getItem('authToken'); 
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/user/change-password`, passwordData, { headers });
  }

}



