import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditUsuario } from '../../components/edit-usuario/edit-usuario';

interface UserRow {
  id: string;
  name: string;
  role: string;
  status: string;
  email: string;
  access: string;
}

@Component({
  standalone: true,
  selector: 'app-users-section',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
  imports: [CommonModule, EditUsuario]
})
export class UsersComponent {
  users = signal<UserRow[]>([
    { id: '#U001', name: 'Juan Perez', role: 'Admin', status: 'Active', email: 'juan@example.com', access: 'Full' },
    { id: '#U002', name: 'Maria Lopez', role: 'Editor', status: 'Active', email: 'maria@example.com', access: 'Limited' },
    { id: '#U003', name: 'Carlos Ruiz', role: 'Viewer', status: 'Suspended', email: 'carlos@example.com', access: 'Read' }
  ]);
  selectedUser = signal<UserRow | null>(null);
  showEditUserModal = signal(false);

  openEditUser(u: UserRow) {
    this.selectedUser.set({ ...u });
    this.showEditUserModal.set(true);
  }
  closeEditUserModal() { this.showEditUserModal.set(false); }

  onUserSave(updated: UserRow) {
    const list = this.users().map(u => u.id === updated.id ? { ...updated } : u);
    this.users.set(list);
    this.closeEditUserModal();
  }
}
