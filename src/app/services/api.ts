import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { LoginResponse, Brand, Order, ToggleStatusResponse, EarningsResponse } from '../interfaces/interfaces';

export interface UserData {
	id?: number;
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	birthday: string;
	courier?: any;
	avatar: string;
}


@Injectable({
	providedIn: 'root'
})

export class ApiService {

	private apiUrl = 'http://localhost:8000/api'; // para probar en navegador
	//private apiUrl = 'http://10.0.2.2:8000/api'; // para probar en android studio
	//public apiUrl = 'https://kdtapp.openit.ar/api';


	constructor(
		private http: HttpClient
	) { }


	private getToken(): Observable<string | null> {
		return from(Preferences.get({ key: 'authToken' })).pipe(
			switchMap(token => {
				if (!token || !token.value) {
					return throwError(() => new Error('Token de autenticación no encontrado'));
				}
				return from([token.value]);
			})
		);
	}

	// --- Helper para crear cabeceras con token ---
	private createAuthHeaders(token: string): HttpHeaders {
		return new HttpHeaders({
			'Authorization': `Bearer ${token}`,
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		});
	}

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

	async savePushNotificationsToken(tokenData: any): Promise<Observable<any>> { //// GUARDAR EL TOKEN DE NOTIFICACIONES PUSH EN LA BBDD
		const headers = await this.createHeadersWithToken();
		return this.http.post(`${this.apiUrl}/registerPushToken`, tokenData, { headers });
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
		const headers = await this.createHeadersWithToken();
		return this.http.post(`${this.apiUrl}/requests/create`, data, { headers, withCredentials: true }); /// enviamos los datos y devolvemos la respuesta. Hay que ver que los datos estén bien antes de llamar a esta función!
	}

	deleteRequest(id: number): Observable<any> {
		return from(Preferences.get({ key: 'authToken' })).pipe(
			switchMap(token => {
				if (!token || !token.value) {
					return throwError(() => new Error('Token de autenticación no encontrado'));
				}
				const headers = new HttpHeaders({
					'Authorization': `Bearer ${token.value}`,
					'Accept': 'application/json'
				});

				return this.http.delete<any>(
					`${this.apiUrl}/requests/${id}`,
					{ headers }
				);
			})
		);
	}

	updateRequest(request: any): Observable<any> {

		return from(Preferences.get({ key: 'authToken' })).pipe(
			switchMap(token => {
				if (!token || !token.value) {
					return throwError(() => new Error('Token de autenticación no encontrado'));
				}

				// 2. Crea los headers con el token
				const headers = new HttpHeaders({
					'Authorization': `Bearer ${token.value}`,
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				});


				return this.http.put<any>(
					`${this.apiUrl}/requests/${request.id}`,
					request,
					{ headers }
				);
			})
		);
	}

	///// SOLICITUDES -  REQUESTS----------------------------------------------------------------------------
	async getRequests() {
		const headers = await this.createHeadersWithToken();
		return this.http.get<any>(`${this.apiUrl}/requests`, { headers, withCredentials: true }); /// enviamos los datos y devolvemos la respuesta. Hay que ver que los datos estén bien antes de llamar a esta función!
	}

	async getRequestOffers(requestId: number) {
		const headers = await this.createHeadersWithToken();
		return this.http.get<any>(`${this.apiUrl}/requests/${requestId}/offers`, { headers, withCredentials: true });
	}


	/// DATOS DE USUARIO --------------------------------------------------------------------------------------
	getUserData(userId: number): Observable<UserData> {
		return this.http.get<UserData>(`${this.apiUrl}/users/${userId}`);
	}

	updateUserData(userId: number, data: UserData): Observable<UserData> {
        return this.getToken().pipe(
            switchMap(token => {
                const headers = this.createAuthHeaders(token as string);

                // 3. Lanza la petición PUT con los headers correctos
                return this.http.put<UserData>(`${this.apiUrl}/users/${userId}`, data, { headers });
            })
        );
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

	

	/// VEHÍCULOS ---------------------------------------------------------------------------------------------------
	async getVehicles(){
		const headers = await this.createHeadersWithToken();
		return this.http.get<any>(`${this.apiUrl}/vehicles`, { headers, withCredentials: true })
	}

	async changeVehicle(vehicle_id:number){
		const headers = await this.createHeadersWithToken();
		return this.http.post<any>(`${this.apiUrl}/change_vehicle`,{"vehicle_id":vehicle_id}, { headers, withCredentials: true })
	}
	async deleteVehicle(vehicle_id:number){
		const headers = await this.createHeadersWithToken();
		return this.http.post<any>(`${this.apiUrl}/delete_vehicle`,{"vehicle_id":vehicle_id}, { headers, withCredentials: true })
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

	// AÑADIDO: Aceptar una oferta
	acceptOffer(requestId: number, offerId: number): Observable<any> {
		return this.getToken().pipe(
			switchMap(token => {
				const headers = this.createAuthHeaders(token as string);
				return this.http.post(`${this.apiUrl}/requests/${requestId}/offers/${offerId}/accept`, {}, { headers, withCredentials: true });
			})
		);
	}

	async createHeadersWithToken() { // CREA LOS HEADERS PARA CADA PETICIÓN CON EL TOKEN DE AUTORIZACIÓN DEL USUARIO
		const { value: token } = await Preferences.get({ key: 'authToken' }); //// obtiene el token de sesión
		const headers = new HttpHeaders({  /// acá ingresamos el token en el header
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		});
		return headers;
	}
	toggleCourierStatus(): Observable<ToggleStatusResponse> {
		return this.getToken().pipe(
			switchMap(token => {
				// getToken() ya lanza un error si no lo encuentra,
				// así que podemos asumir que 'token' existe aquí.
				const headers = this.createAuthHeaders(token as string);

				// Hacemos la llamada POST a la ruta de Laravel
				return this.http.post<ToggleStatusResponse>(
					`${this.apiUrl}/courier/toggle-status`,
					{}, // Cuerpo vacío
					{ headers }
				);
			})
		);
	}

	/** OBTIENE EL PEDIDO ACTIVO*/
	getActiveOrder(): Observable<Order | null> { // Es Order o null
		return from(Preferences.get({ key: 'authToken' })).pipe(
			switchMap(token => {
				if (!token || !token.value) {
					return throwError(() => new Error('Token no encontrado'));
				}

				const headers = new HttpHeaders({
					'Authorization': `Bearer ${token.value}`,
					'Accept': 'application/json'
				});

				return this.http.get<Order | null>(`${this.apiUrl}/courier/active-order`, { headers });
			})
		);
	}



	// funciones de see-list

	getAvailableRequests(): Observable<any[]> { 
    return from(Preferences.get({ key: 'authToken' })).pipe(
      switchMap(token => {
        if (!token || !token.value) {
          return throwError(() => new Error('Token no encontrado'));
        }
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token.value}` });
        
        return this.http.get<any[]>(`${this.apiUrl}/requests/available`, { headers, withCredentials: true });
      })
    );
  }

  makeOffer(requestId: number, price: number): Observable<any> {
    return from(Preferences.get({ key: 'authToken' })).pipe(
      switchMap(token => {
        if (!token || !token.value) {
          return throwError(() => new Error('Token no encontrado'));
        }
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token.value}` });
        const body = { price: price };
        const url = `${this.apiUrl}/requests/${requestId}/make_offer`; // O '/offers' si la renombraste
        
        return this.http.post<any>(url, body, { headers, withCredentials: true });
      })
    );
  }

  // funciones orders-detail

  getOrderDetail(orderId: number | string): Observable<Order> {
    return from(Preferences.get({ key: 'authToken' })).pipe(
      switchMap(token => {
        if (!token || !token.value) {
          return throwError(() => new Error('Token no encontrado'));
        }
        
        // Usamos tu helper 'createAuthHeaders' o creamos uno
        const headers = new HttpHeaders({ 
          'Authorization': `Bearer ${token.value}`,
          'Accept': 'application/json'
        });
        
        // Llama a la ruta de detalles que ya creamos
        return this.http.get<Order>(`${this.apiUrl}/orders/${orderId}/details`, { headers });
      })
    );
  }

  //funciones de orders.page.ts

  getUserOrders(): Observable<Order[]> { 
    return from(Preferences.get({ key: 'authToken' })).pipe(
      switchMap(token => {
        if (!token || !token.value) {
          return throwError(() => new Error('Token no encontrado'));
        }
        
        
        const headers = new HttpHeaders({ 
          'Authorization': `Bearer ${token.value}`,
          'Accept': 'application/json'
        });
        

        return this.http.get<Order[]>(`${this.apiUrl}/user/my-orders`, { headers, withCredentials: true });
      })
    );
  }


	/** COMPLETA EL PEDIDO*/
	completeOrder(orderId: number): Observable<any> {
		return from(Preferences.get({ key: 'authToken' })).pipe(
			switchMap(token => {
				if (!token || !token.value) {
					return throwError(() => new Error('Token no encontrado'));
				}

				const headers = new HttpHeaders({
					'Authorization': `Bearer ${token.value}`,
					'Accept': 'application/json'
				});

				// Es un POST, pero no necesita body, por eso enviamos {}
				return this.http.post<any>(`${this.apiUrl}/orders/${orderId}/complete`, {}, { headers });
			})
		);
	}

	

	getOrderHistory(): Observable<Order[]> {
		return from(Preferences.get({ key: 'authToken' })).pipe(
			switchMap(token => {
				if (!token || !token.value) {
					return throwError(() => new Error('Token no encontrado'));
				}

				const headers = new HttpHeaders({
					'Authorization': `Bearer ${token.value}`,
					'Accept': 'application/json'
				});

				// Llama a la nueva ruta que creamos en Laravel
				return this.http.get<Order[]>(`${this.apiUrl}/courier/order-history`, { headers });
			})
		);
	}

	//manejar mensaje de inicio segun hay o no solicitudes activAS
	getAvailableRequestsCount(): Observable<{ available_count: number }> {
		return from(Preferences.get({ key: 'authToken' })).pipe(
			switchMap(token => {
				if (!token || !token.value) {
					return throwError(() => new Error('Token no encontrado'));
				}

				const headers = new HttpHeaders({
					'Authorization': `Bearer ${token.value}`,
					'Accept': 'application/json'
				});

				// Llama a la nueva ruta que creamos en Laravel
				return this.http.get<{ available_count: number }>(`${this.apiUrl}/requests/available-count`, { headers });
			})
		);
	}


	getEarnings(filter: 'today' | 'total'): Observable<EarningsResponse> { 
    return from(Preferences.get({ key: 'authToken' })).pipe(
      switchMap(token => {
        if (!token || !token.value) {
          return throwError(() => new Error('Token no encontrado'));
        }
        
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token.value}`,
          'Accept': 'application/json'
        });
        
        // ¡Añadimos el parámetro de filtro a la URL!
        const url = `${this.apiUrl}/courier/earnings?filter=${filter}`;
        
        return this.http.get<EarningsResponse>(url, { headers });
      })
    );}
}
