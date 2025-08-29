import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, catchError, map, throwError } from 'rxjs';

export interface AdminRegisterPayload { username: string; email: string; password: string; }
export interface AdminRegisterResponse { message?: string; errors?: any; detail?: string; }
export interface AdminLoginPayload { email: string; password: string; }
export interface AdminLoginResponse { refresh?: string; access?: string; username?: string; email?: string; detail?: string; }

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private adminSecret = environment.adminSecret; // mover a variable de entorno real en producción

  private ACCESS_KEY = 'access_admin';
  private REFRESH_KEY = 'refresh_admin';
  private USER_KEY = 'admin_user';

  registerAdmin(data: AdminRegisterPayload): Observable<AdminRegisterResponse> {
    const body = { ...data, admin_secret: this.adminSecret };
    return this.http.post<AdminRegisterResponse>(`${this.baseUrl}/admin-register/`, body).pipe(
      catchError(err => this.handleError(err))
    );
  }

  loginAdmin(email: string, password: string): Observable<AdminLoginResponse> {
    const body: AdminLoginPayload = { email, password };
    return this.http.post<AdminLoginResponse>(`${this.baseUrl}/admin-login/`, body).pipe(
      map(res => {
        if (res.access) localStorage.setItem(this.ACCESS_KEY, res.access);
        if (res.refresh) localStorage.setItem(this.REFRESH_KEY, res.refresh);
        if (res.username || res.email) {
          const user = { username: res.username, email: res.email };
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        }
        return res;
      }),
      catchError(err => this.handleError(err))
    );
  }

  getAdminAccessToken(): string | null { return localStorage.getItem(this.ACCESS_KEY); }
  getAdminRefreshToken(): string | null { return localStorage.getItem(this.REFRESH_KEY); }
  getAdminUser(): any | null {
    const raw = localStorage.getItem(this.USER_KEY);
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  }

  logoutAdmin(): void {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Error de red o CORS', error.error);
    } else if (error.status === 400) {
      console.error('Error 400 - Validación', error.error);
    } else if (error.status === 401) {
      console.error('Error 401 - Credenciales inválidas o inactivo', error.error);
    } else if (error.status === 403) {
      console.error('Error 403 - No autorizado / No es admin / secret incorrecto', error.error);
    } else {
      console.error(`Error ${error.status}`, error.error);
    }
    return throwError(() => error);
  }
}
