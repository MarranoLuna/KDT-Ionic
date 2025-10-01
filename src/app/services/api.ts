import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
import { LoginResponse } from '../interfaces/interfaces';


export interface UserData {
  id?: number; 
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  birthday: string;
}

@Injectable({
	providedIn: 'root'
})

export class ApiService {

	private apiUrl = 'http://localhost:8000/api';


	constructor(
		private http: HttpClient,
		private router: Router
	) { }


	login(credentials: any): Observable<LoginResponse> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<LoginResponse>(`${this.apiUrl}/ion_login`, credentials, { headers });
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

	getUserData(userId: number): Observable<UserData> {
		return this.http.get<UserData>(`${this.apiUrl}/users/${userId}`);
	}

	updateUserData(userId: number, data: UserData): Observable<UserData> {
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		return this.http.put<UserData>(`${this.apiUrl}/users/${userId}`, data, { headers });
	}

  // Nuevo método para guardar una dirección
  saveAddress(addressData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Si necesitas enviar un token de autenticación (por ejemplo, JWT), añádelo aquí
      // 'Authorization': `Bearer ${token}` 
    });

    return this.http.post(`${this.apiUrl}/addresses`, addressData, { headers });
  }

}
