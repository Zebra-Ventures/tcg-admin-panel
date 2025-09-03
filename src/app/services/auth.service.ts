import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

// Adjust if you add environment files later
const API_BASE = 'http://localhost:8000/api/auth';

export interface RegisterPayload { username: string; email: string; password: string; }
export interface AuthTokens { access: string; refresh: string; }
export interface LoginResponse extends AuthTokens { username: string; email: string; }

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
  adminRegister(data: RegisterPayload, adminSecret: string): Observable<any> {
    return this.http.post(`${API_BASE}/admin-register/`, { ...data, admin_secret: adminSecret });
  }
  adminLogin(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_BASE}/admin-login/`, { email, password })
      .pipe(tap(r => this.storeTokens(r)));
  }
  storeTokens(tokens: AuthTokens) {
    localStorage.setItem('access', tokens.access);
    localStorage.setItem('refresh', tokens.refresh);
  }
  clearTokens(){
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }
  get accessToken(){ return localStorage.getItem('access'); }
  get refreshToken(){ return localStorage.getItem('refresh'); }
}
