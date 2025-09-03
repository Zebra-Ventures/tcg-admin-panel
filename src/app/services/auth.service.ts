import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

const API_BASE = environment.apiUrl; // debe apuntar a http://localhost:8000/api/auth

export interface RegisterPayload { username: string; email: string; password: string; }
export interface AuthTokens { access: string; refresh: string; }
export interface LoginResponse extends AuthTokens { username: string; email: string; }
export interface BackendUser { id: number; username: string; email: string; is_active: boolean; is_admin: boolean; }
// Nuevo payload parcial para PATCH
export interface UpdateUserPayload { username?: string; email?: string; is_active?: boolean; is_admin?: boolean; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  register(data: RegisterPayload): Observable<any> {
    return this.http.post(`${API_BASE}/register/`, data);
  }
  resendActivation(email: string): Observable<any> {
    return this.http.post(`${API_BASE}/recover-user/`, { email });
  }
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_BASE}/login/`, { email, password })
      .pipe(tap(r => this.storeTokens(r)));
  }
  adminRegister(data: RegisterPayload, adminSecret: string = environment.adminSecret): Observable<any> {
    return this.http.post(`${API_BASE}/admin-register/`, { ...data, admin_secret: adminSecret });
  }
  adminLogin(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_BASE}/admin-login/`, { email, password })
      .pipe(tap(r => {
        console.log('[AuthService] adminLogin response:', r);
        this.storeTokens(r);
      }));
  }
  fetchUsers(): Observable<BackendUser[]> {
    console.log('[AuthService] GET', `${API_BASE}/users/`, 'usando token?', !!this.accessToken);
    return this.http.get<BackendUser[]>(`${API_BASE}/users/`);
  }

  deleteUser(id: number): Observable<void> {
    console.log('[AuthService] DELETE', `${API_BASE}/users/${id}/`);
    return this.http.delete<void>(`${API_BASE}/users/${id}/`);
  }

  // Nuevo: actualizar usuario (PATCH)
  updateUser(id: number, data: UpdateUserPayload): Observable<BackendUser> {
    console.log('[AuthService] PATCH', `${API_BASE}/users/${id}/`, 'payload:', data);
    return this.http.patch<BackendUser>(`${API_BASE}/users/${id}/`, data);
  }

  fetchUsersWithToken(token: string): Observable<BackendUser[]> {
    console.log('[AuthService] GET (manual token)', `${API_BASE}/users/`);
    return this.http.get<BackendUser[]>(`${API_BASE}/users/`, { headers: { Authorization: `Bearer ${token}` } });
  }
  confirmUser(uid: string, token: string): Observable<any> {
    return this.http.get(`${API_BASE}/confirm/${uid}/${token}/`);
  }

  storeTokens(tokens: AuthTokens) {
    localStorage.setItem('access', tokens.access);
    localStorage.setItem('refresh', tokens.refresh);
  }
  // Nuevo: set manual de access token (para inyectar uno válido obtenido externamente)
  setAccessToken(token: string){ localStorage.setItem('access', token); }
  clearTokens(){
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }
  get accessToken(){ return localStorage.getItem('access'); }
  get refreshToken(){ return localStorage.getItem('refresh'); }
}
