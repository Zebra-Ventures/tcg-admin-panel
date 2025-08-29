import { Routes } from '@angular/router';
import { AdminAuthComponent } from './pages/admin-auth/admin-auth.component';
import { AdminPanel } from './components/admin-panel/admin-panel';

export const routes: Routes = [
  { path: 'admin-auth', component: AdminAuthComponent },
  { path: 'admin-panel', component: AdminPanel },
  { path: '', redirectTo: 'admin-auth', pathMatch: 'full' }
];
