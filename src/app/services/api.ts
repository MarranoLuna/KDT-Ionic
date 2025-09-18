import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap} from 'rxjs';
import { Preferences } from '@capacitor/preferences';



interface LoginResponse {
  token: string;
  user?: any; // opcional si el backend devuelve datos del usuario
}
export interface UserData {
  id?: number; 
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  birthdate: string;
}

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private apiUrl = 'http://localhost:8000/api';


  constructor(private http: HttpClient) { }


  login(credentials: any): Observable<LoginResponse> {

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<LoginResponse>(`${this.apiUrl}/ion_login`, credentials, { headers }
    ).pipe(
      tap(async (res) => {
        // Si el backend devuelve un token, lo guardamos en Preferences de Capacitor 
        if (res.token) {
          Preferences.set({ key: 'authToken', value: res.token }).then(
            () => {
              console.log('Token guardado en Preferences');
              console.log('Token:', res.token);
            }
          );
        }
      })
    );
  }

  registerUser(userData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/register`, userData, { headers });
  }

  createRequest(data: any) {
    return this.http.post(`${this.apiUrl}/requests`, data);
  }

  deleteRequest(id: number) {
    return this.http.delete(`${this.apiUrl}/requests/${id}`);
  }

  updateRequest(request: any) {
    return this.http.put<any>(`http://localhost:8000/api/requests/${request.id}`, request);
  }

  verify_login(data: any) {
    // 1. Obtener el token guardado (usuarios que iniciaron sesión)
    const token = localStorage.getItem('token');
    // 2. Crear los headers con Authorization
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    // 3. Pasar los headers en la petición
    return this.http.post(`${this.apiUrl}/requests`, data, { headers });
  }


  getUserData(userId: number): Observable<UserData> {
    return this.http.get<UserData>(`${this.apiUrl}/users/${userId}`);
  }

  updateUserData(userId: number, data: UserData): Observable<UserData> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<UserData>(`${this.apiUrl}/users/${userId}`, data, { headers });
  }

}
