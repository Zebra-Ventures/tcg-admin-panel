import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminAuthService } from '../../services/admin-auth.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-admin-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-auth.component.html',
  styleUrl: './admin-auth.component.scss',
})
export class AdminAuthComponent {
  private fb = inject(FormBuilder);
  private adminAuth = inject(AdminAuthService);
  private router = inject(Router);

  mode = signal<'login' | 'register'>('login');
  loading = signal(false);
  errorMsg = signal<string | null>(null);
  successMsg = signal<string | null>(null);

  // Login sin validaciones estrictas como solicitaste
  loginForm = this.fb.group({
    email: [''],
    password: [''],
  });

  // Registro mantiene validaciones
  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    adminSecret: ['', [Validators.required]],
  });

  switchMode(m: 'login' | 'register') {
    this.mode.set(m);
    this.errorMsg.set(null);
    this.successMsg.set(null);
  }

  submitLogin() {
    const { email, password } = this.loginForm.value;
    this.loading.set(true);
    this.errorMsg.set(null);
    this.successMsg.set(null);
    console.log('[AdminAuthComponent] submitLogin -> endpoint base:', this.adminAuth.getBaseUrl());
    this.adminAuth
      .loginAdmin(email || '', password || '')
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          const access = this.adminAuth.getAdminAccessToken();
          const user = this.adminAuth.getAdminUser();
          console.log('[AdminAuthComponent] Login OK. access (inicio):', access?.substring(0, 25) + '...');
          console.log('[AdminAuthComponent] User almacenado:', user);
          this.successMsg.set('Login exitoso');
          this.router.navigate(['/admin-panel']);
        },
        error: (err) => {
          this.errorMsg.set(this.mapError(err));
        },
      });
  }

  submitRegister() {
    if (this.registerForm.invalid) return;
    const { username, email, password, adminSecret } = this.registerForm.value;
    this.loading.set(true);
    this.errorMsg.set(null);
    this.successMsg.set(null);
    console.log('[AdminAuthComponent] submitRegister -> endpoint base:', this.adminAuth.getBaseUrl());
    this.adminAuth
      .registerAndLoginAdmin({ username: username || '', email: email || '', password: password || '' }, adminSecret || '')
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          console.log('[AdminAuthComponent] Registro+Login OK. Respuesta login:', res);
          this.successMsg.set('Registro y sesión iniciada');
          this.router.navigate(['/admin-panel']);
        },
        error: (err) => {
          this.errorMsg.set(this.mapError(err));
        },
      });
  }

  private mapError(err: any): string {
    if (!err || !err.status) return 'Error desconocido';
    if (err.status === 0) return 'Servidor no disponible';
    if (err.status === 400) return 'Error de validación';
    if (err.status === 401) return 'Credenciales inválidas';
    if (err.status === 403) return 'No autorizado';
    return 'Error ' + err.status;
  }
}
