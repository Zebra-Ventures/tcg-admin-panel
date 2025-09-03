import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, catchError, map, throwError, tap, switchMap } from 'rxjs';

export interface AdminRegisterPayload { username: string; email: string; password: string; }
export interface AdminRegisterResponse { message?: string; errors?: any; detail?: string; uid?: string; token?: string; }
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

  // Nuevo: exponer base URL para logs externos
  getBaseUrl(){ return this.baseUrl; }

  registerAdmin(data: AdminRegisterPayload, adminSecret?: string): Observable<AdminRegisterResponse> {
    const secretToUse = adminSecret || this.adminSecret;
    const body = { ...data, admin_secret: secretToUse };
    const url = `${this.baseUrl}/admin-register/`;
    console.log('[AdminAuthService] POST', url, 'body:', { ...body, password: '***' });
    return this.http.post<AdminRegisterResponse>(url, body).pipe(
      tap(res => console.log('[AdminAuthService] registerAdmin response:', res)),
      catchError(err => this.handleError(err))
    );
  }

  // Confirmación directa usando endpoint confirm/<uid>/<token>/
  confirmAdmin(uid: string, token: string): Observable<any> {
    const url = `${this.baseUrl}/confirm/${uid}/${token}/`;
    console.log('[AdminAuthService] GET', url, '(auto-confirm)');
    return this.http.get(url).pipe(
      tap(() => console.log('[AdminAuthService] admin confirmado automáticamente')),
      catchError(err => this.handleError(err))
    );
  }

  // Registro + (si procede) confirmación + login automático
  registerAndLoginAdmin(data: AdminRegisterPayload, adminSecret?: string): Observable<AdminLoginResponse> {
    return this.registerAdmin(data, adminSecret).pipe(
      switchMap(res => {
        // Si el backend devuelve uid y token, confirmamos antes de loguear
        if (res.uid && res.token) {
          return this.confirmAdmin(res.uid, res.token).pipe(
            tap(() => console.log('[AdminAuthService] Confirmación previa completada, procediendo a login')),
            switchMap(() => this.loginAdmin(data.email, data.password))
          );
        }
        console.log('[AdminAuthService] Sin uid/token en respuesta de registro, se asume usuario ya activo');
        return this.loginAdmin(data.email, data.password);
      })
    );
  }

  loginAdmin(email: string, password: string): Observable<AdminLoginResponse> {
    const body: AdminLoginPayload = { email, password };
    const url = `${this.baseUrl}/admin-login/`;
    console.log('[AdminAuthService] POST', url, 'body:', body);
    return this.http.post<AdminLoginResponse>(url, body).pipe(
      tap(res => console.log('[AdminAuthService] loginAdmin raw response:', res)),
      map(res => {
        if (res.access) {
          localStorage.setItem(this.ACCESS_KEY, res.access);
          localStorage.setItem('access', res.access); // clave genérica para interceptor
          console.log('[AdminAuthService] access token stored (admin & generic)');
        }
        if (res.refresh) {
          localStorage.setItem(this.REFRESH_KEY, res.refresh);
          localStorage.setItem('refresh', res.refresh); // clave genérica
          console.log('[AdminAuthService] refresh token stored (admin & generic)');
        }
        if (res.username || res.email) {
          const user = { username: res.username, email: res.email };
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
          console.log('[AdminAuthService] user stored:', user);
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
    console.log('[AdminAuthService] logoutAdmin: tokens y usuario eliminados');
  }

  private handleError(error: HttpErrorResponse) {
    console.error('[AdminAuthService] HTTP error status', error.status, 'body:', error.error);
    if (error.status === 0) {
      console.error('Error de red o CORS', error.error);
    } else if (error.status === 400) {
      console.error('Error 400 - Validación', error.error);
    } else if (error.status === 401) {
      console.error('Error 401 - Credenciales inválidas o inactivo', error.error);
    } else if (error.status === 403) {
      console.error('Error 403 - No autorizado / No es admin / secret incorrecto', error.error);
    }
    return throwError(() => error);
  }
}
