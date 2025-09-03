import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-confirm-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-account.component.html',
  styleUrl: './confirm-account.component.scss'
})
export class ConfirmAccountComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);

  loading = signal(true);
  success = signal<boolean | null>(null);
  message = signal('Confirmando cuenta...');
  // Expose window.location for template usage (location.reload())
  location = window.location;

  ngOnInit(): void {
    const uid = this.route.snapshot.paramMap.get('uid');
    const token = this.route.snapshot.paramMap.get('token');
    if (!uid || !token) {
      this.loading.set(false);
      this.success.set(false);
      this.message.set('Parámetros inválidos');
      return;
    }
    this.auth.confirmUser(uid, token).subscribe({
      next: (res: any) => {
        this.loading.set(false);
        this.success.set(true);
        this.message.set('Cuenta confirmada correctamente. Redirigiendo al login...');
        setTimeout(() => this.router.navigate(['/admin-auth']), 2500);
      },
      error: err => {
        this.loading.set(false);
        this.success.set(false);
        if (err.status === 400 || err.status === 404) {
          this.message.set('Enlace inválido o expirado. Solicita un nuevo correo de activación.');
        } else {
          this.message.set('Error al confirmar. Inténtalo más tarde.');
        }
      }
    });
  }
}
