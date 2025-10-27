import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
import { LoginResponse } from '../interfaces/interfaces';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Brand } from '../interfaces/interfaces';


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
		//private router: Router
	) { }

	/////// LOGIN ----------------------------------------------------------------------------------------------------

	login(credentials: any): Observable<LoginResponse> { /// recibe las credenciales y devuelve la respuesta del login
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });/// indica que los datos se envían como json
		return this.
			http.
			post<LoginResponse>( /// el método post recibe la api
				`${this.apiUrl}/ion_login`, /// el link de la ruta
				credentials, // los datos a enviar
				{ headers } // los headers 
			);
	}


	registerUser(userData: any): Observable<any> {
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		return this.http.post(`${this.apiUrl}/register`, userData, { headers });
	}

	
	registerCourier(data: any): Observable<any> {
    // 1. Convierte la promesa de Preferences (obtener token) en un Observable
    return from(Preferences.get({ key: 'authToken' })).pipe(
      
      // 2. Usa 'switchMap' para tomar el token y "cambiar" a una llamada HTTP
      switchMap(tokenData => {
        
        if (!tokenData.value) {
          // Si no hay token, lanza un error
          throw new Error('Token de autenticación no encontrado.');
        }

        // 3. Crea los headers con el token
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${tokenData.value}`,
          'Accept': 'application/json'
        });

        // 4. Llama a la ruta de tu backend
        return this.http.post(`${this.apiUrl}/courier/register`, data, { headers });
      })
    );
  }

	///// FUNCIONES DE NEW REQUEST----------------------------------------------------------------------------

	async createRequest(data: any) {
		const { value: token } = await Preferences.get({ key: 'authToken' }); //// obtiene el token de sesión
		const headers = new HttpHeaders({  /// acá ingresamos el token en el header
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		 });
		return this.http.post(`${this.apiUrl}/requests/create`, data, { headers, withCredentials: true }); /// enviamos los datos y devolvemos la respuesta. Hay que ver que los datos estén bien antes de llamar a esta función!
	}

	deleteRequest(id: number) {
		return this.http.delete(`${this.apiUrl}/requests/${id}`);
	}

	updateRequest(request: any) {
		return this.http.put<any>(`http://localhost:8000/api/requests/${request.id}`, request);
	}

	/// DATOS DE USUARIO --------------------------------------------------------------------------------------
	getUserData(userId: number): Observable<UserData> {
		return this.http.get<UserData>(`${this.apiUrl}/users/${userId}`);
	}

	updateUserData(userId: number, data: UserData): Observable<UserData> {
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		return this.http.put<UserData>(`${this.apiUrl}/users/${userId}`, data, { headers });
	}

	/// Nuevo método para guardar una dirección
	saveAddress(addressData: any): Observable<any> {
		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			// Si necesitas enviar un token de autenticación (por ejemplo, JWT), añádelo aquí
			// 'Authorization': `Bearer ${token}` 
		});

		return this.http.post(`${this.apiUrl}/addresses`, addressData, { headers });
	}

	updatePassword(passwordData: any): Observable<any> {
		// Convertimos la promesa de Preferences en un Observable para poder encadenar operaciones
		return from(Preferences.get({ key: 'authToken' })).pipe(
			// Usamos switchMap para tomar el valor del token y "cambiar" a una nueva operación (la llamada HTTP)
			switchMap(token => {
				// Si no hay token, podemos devolver un error o simplemente no hacer la llamada
				if (!token || !token.value) {
					throw new Error('Token de autenticación no encontrado');
				}

				// Creamos los encabezados con el token
				const headers = new HttpHeaders({
					'Authorization': `Bearer ${token.value}`
				});

				// Hacemos la llamada HTTP y la retornamos
				return this.http.put(`${this.apiUrl}/user/password`, passwordData, { headers });
			})
		);
	}

	// getBrands(): Observable<Brand[]> {
	//   return this.http.get<Brand[]>(`${this.apiUrl}/brands`);
	// }

	getMotorcycleBrands(): Observable<Brand[]> {
		return this.http.get<Brand[]>(`${this.apiUrl}/motorcycle-brands`);
	}

	getBicycleBrands(): Observable<Brand[]> {
		return this.http.get<Brand[]>(`${this.apiUrl}/bicycle-brands`);
	}





}
