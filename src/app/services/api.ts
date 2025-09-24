import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';


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


	constructor(
		private http: HttpClient,
		private router: Router
	) { }


	login(credentials: any): Observable<LoginResponse> {

		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		return this.http.post<LoginResponse>(`${this.apiUrl}/ion_login`, credentials, { headers }
		).pipe(
			tap(async (res) => {
				// Si el backend devuelve un token, lo guardamos en Preferences de Capacitor 
				if (res.token) {
					// GUARDAR DATOS DEL USUARIO EN PREFERENCES:
					await Preferences.set({key:'user', value: JSON.stringify(res.user) }); 
					// GUARDAR TOKEN:
					Preferences.set({ key: 'authToken', value: res.token }).then(() => {
							this.router.navigate(['/home']);
						}
					);
				}
			})
		);
	}

	async logout(): Promise<void> {
		Preferences.clear();
		this.verifyLogin();
	}

	async verifyLogin() {
		const { value } = await Preferences.get({ key: 'authToken' });

		if (value == null) {
			this.router.navigate(['/login']);
		}
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

}
