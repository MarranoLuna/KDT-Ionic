import { Injectable } from '@angular/core';
import { UserData } from './api'; 

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

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
}


