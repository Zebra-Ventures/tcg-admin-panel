import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditUsuario } from '../../components/edit-usuario/edit-usuario';
import { AuthService, UpdateUserPayload } from '../../services/auth.service';

interface UserRow {
  id: string;
  name: string;
  role: string;
  status: string;
  email: string;
  access: string;
  // store original numeric id for actions
  _numId?: number;
  // optional banned flag if backend returns it later
  is_banned?: boolean;
}

@Component({
  standalone: true,
  selector: 'app-users-section',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
  imports: [CommonModule, EditUsuario]
})
export class UsersComponent implements OnInit {
  constructor(private auth: AuthService) {}

  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  users = signal<UserRow[]>([]);
  selectedUser = signal<UserRow | null>(null);
  showEditUserModal = signal(false);
  savingEdit = signal<boolean>(false);
  editError = signal<string | null>(null);

  // Delete confirmation modal state
  showDeleteConfirm = signal(false);
  userToDelete = signal<UserRow | null>(null);
  deletingUser = signal(false);
  deleteError = signal<string | null>(null);

  // Ban confirmation modal state
  showBanConfirm = signal(false);
  userToBan = signal<UserRow | null>(null);
  banningUser = signal(false);
  banError = signal<string | null>(null);

  ngOnInit() { this.loadUsers(); }

  private loadUsers() {
    this.loading.set(true); this.error.set(null);
    this.auth.fetchUsers().subscribe({
      next: list => {
        const mapped: UserRow[] = list.map(u => ({
          id: `#U${u.id.toString().padStart(3, '0')}`,
          name: u.username,
          role: u.is_admin ? 'Admin' : 'User',
          status: u.is_active ? 'Active' : 'Inactive',
          email: u.email,
          access: u.is_admin ? 'Full' : 'Limited',
          _numId: u.id,
          is_banned: (u as any).is_banned
        }));
        // show only non-banned here (if backend supplies flag)
        this.users.set(mapped.filter(x => !x.is_banned));
        this.loading.set(false);
      },
      error: err => { this.error.set('Error cargando usuarios'); this.loading.set(false); }
    });
  }

  openEditUser(u: UserRow) {
    this.selectedUser.set({ ...u }); // keep same shape (includes access)
    this.editError.set(null);
    this.showEditUserModal.set(true);
  }
  closeEditUserModal() { if (this.savingEdit()) return; this.showEditUserModal.set(false); }

  onUserSave(updated: UserRow) {
    if (!updated._numId && this.selectedUser()) {
      updated._numId = this.selectedUser()!._numId; // ensure numeric id preserved
    }
    if (!updated._numId) { return; }

    // Build PATCH payload translating UI fields -> backend
    const payload: UpdateUserPayload = {
      username: updated.name,
      email: updated.email,
      is_admin: updated.role === 'Admin',
      is_active: updated.status === 'Active'
    };

    this.savingEdit.set(true);
    this.editError.set(null);

    this.auth.updateUser(updated._numId, payload).subscribe({
      next: backendUser => {
        // Map backend response again to row format to ensure consistency
        const patched: UserRow = {
          id: `#U${backendUser.id.toString().padStart(3, '0')}`,
          name: backendUser.username,
          role: backendUser.is_admin ? 'Admin' : 'User',
          status: backendUser.is_active ? 'Active' : 'Inactive',
          email: backendUser.email,
          access: backendUser.is_admin ? 'Full' : 'Limited',
          _numId: backendUser.id,
          is_banned: (backendUser as any).is_banned
        };
        this.users.set(this.users().map(u => u._numId === patched._numId ? patched : u));
        this.savingEdit.set(false);
        this.showEditUserModal.set(false);
      },
      error: err => {
        console.error('Error actualizando usuario', err);
        this.editError.set('Error guardando cambios');
        this.savingEdit.set(false);
      }
    });
  }

  deleteUser(u: UserRow) {
    // replaced by modal opener
    if (!u._numId) return;
    this.openDeleteConfirm(u);
  }

  openDeleteConfirm(u: UserRow){
    if (this.deletingUser()) return;
    this.userToDelete.set(u);
    this.deleteError.set(null);
    this.showDeleteConfirm.set(true);
  }
  cancelDelete(){
    if (this.deletingUser()) return;
    this.showDeleteConfirm.set(false);
    this.userToDelete.set(null);
  }
  confirmDelete(){
    const u = this.userToDelete();
    if (!u || !u._numId) return;
    this.deletingUser.set(true);
    this.deleteError.set(null);
    this.auth.deleteUser(u._numId).subscribe({
      next: () => {
        this.users.set(this.users().filter(x => x._numId !== u._numId));
        this.deletingUser.set(false);
        this.showDeleteConfirm.set(false);
        this.userToDelete.set(null);
      },
      error: err => {
        console.error('Error eliminando usuario', err);
        this.deleteError.set('Error eliminando usuario');
        this.deletingUser.set(false);
      }
    });
  }

  // Ban flow (modal)
  banUser(u: UserRow) { this.openBanConfirm(u); }
  openBanConfirm(u: UserRow){
    if (this.banningUser()) return;
    this.userToBan.set(u);
    this.banError.set(null);
    this.showBanConfirm.set(true);
  }
  cancelBan(){
    if (this.banningUser()) return;
    this.showBanConfirm.set(false);
    this.userToBan.set(null);
  }
  confirmBan(){
    const u = this.userToBan();
    if (!u || !u._numId) return;
    this.banningUser.set(true);
    this.banError.set(null);
    this.auth.banUser(u._numId, 'Manual ban via panel').subscribe({
      next: (res: any) => {
        const backendUser = res.user;
        this.users.set(this.users().filter(x => x._numId !== backendUser.id));
        this.banningUser.set(false);
        this.showBanConfirm.set(false);
        this.userToBan.set(null);
      },
      error: (err: any) => {
        console.error('Error baneando usuario', err);
        this.banError.set('Error baneando usuario');
        this.banningUser.set(false);
      }
    });
  }
}
