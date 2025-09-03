import { Routes } from '@angular/router';
import { AdminAuthComponent } from './pages/admin-auth/admin-auth.component';
import { AdminDashboardComponent } from './components/admin-panel/admin-panel';

export const routes: Routes = [
  { path: 'admin-auth', component: AdminAuthComponent },
  { path: 'confirm-account/:uid/:token', loadComponent: () => import('./pages/confirm-account/confirm-account.component').then(c => c.ConfirmAccountComponent) },
  {
    path: 'admin-panel',
    component: AdminDashboardComponent,
    children: [
      // New English paths
      { path: 'products', loadComponent: () => import('./sections/productos/productos.component').then(c => c.ProductsComponent) },
      { path: 'products/subir', loadComponent: () => import('./components/subir-producto/subir-producto').then(c => c.SubirProducto) },
      { path: 'sales', loadComponent: () => import('./sections/ventas/ventas.component').then(c => c.SalesComponent) },
      { path: 'users', loadComponent: () => import('./sections/usuarios/usuarios.component').then(c => c.UsersComponent) },
      { path: 'users/banned', loadComponent: () => import('./sections/usuarios-baneados/usuarios-baneados.component').then(c => c.BannedUsersComponent) },
      { path: 'settings', loadComponent: () => import('./sections/configuracion/configuracion.component').then(c => c.SettingsComponent) },
      // Legacy spanish redirects
      { path: 'productos', redirectTo: 'products', pathMatch: 'full' },
      { path: 'productos/subir', redirectTo: 'products/subir', pathMatch: 'full' },
      { path: 'ventas', redirectTo: 'sales', pathMatch: 'full' },
      { path: 'usuarios', redirectTo: 'users', pathMatch: 'full' },
      { path: 'configuracion', redirectTo: 'settings', pathMatch: 'full' },
      { path: '', redirectTo: 'products', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'admin-auth', pathMatch: 'full' }
];
