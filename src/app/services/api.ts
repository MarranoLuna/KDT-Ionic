import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api'; // Asegúrate de que esta URL sea la correcta

  constructor(private http: HttpClient) { }

  // Método para obtener todos los posts
  getPosts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts`);
  }

  // Método para crear un nuevo post
  createPost(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/posts`, data, { headers });
  }

  // Método para obtener un post específico
  getPost(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts/${id}`);
  }

  // Método para actualizar un post
  updatePost(id: string, data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.apiUrl}/posts/${id}`, data, { headers });
  }

  // Método para eliminar un post
  deletePost(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/posts/${id}`);
  }

  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
}
