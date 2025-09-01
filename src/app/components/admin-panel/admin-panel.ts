import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.scss'
})
export class AdminDashboardComponent {
  sectionLabel = signal('Productos');
  actionLabel = signal('Agregar');
  showUsersSubmenu = signal(false);

  private labels: Record<string, string> = {
    products: 'Productos',
    sales: 'Ventas',
    users: 'Gestión de usuarios',
    settings: 'Configuración',
    banned: 'Usuarios baneados'
  };
  private actionLabels: Record<string, string> = {
    products: 'Agregar producto',
    sales: 'Registrar venta',
    users: 'Agregar usuario',
    settings: 'Guardar ajustes',
    banned: 'Revisar baneos'
  };

  constructor(private router: Router) {
    this.updateLabelFromUrl(this.router.url);
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => this.updateLabelFromUrl(e.urlAfterRedirects || e.url));
  }

  private updateLabelFromUrl(url: string) {
    const match = url.match(/\/admin-panel\/(\w+)/);
    const seg = match ? match[1] : 'products';
    const label = this.labels[seg] || 'Productos';
    if (this.sectionLabel() !== label) this.sectionLabel.set(label);
    const act = this.actionLabels[seg] || 'Agregar';
    if (this.actionLabel() !== act) this.actionLabel.set(act);

    // Ensure the users submenu is open when we're on any /admin-panel/users route
    if (url.startsWith('/admin-panel/users')) {
      if (!this.showUsersSubmenu()) this.showUsersSubmenu.set(true);
    } else {
      if (this.showUsersSubmenu()) this.showUsersSubmenu.set(false);
    }
  }

  toggleUsersSubmenu() { this.showUsersSubmenu.set(!this.showUsersSubmenu()); }
}
