import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:8000/api'; 


  constructor(private http: HttpClient) { }


  
  


  login(credentials: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/ion_login`, credentials, { headers });
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



}


