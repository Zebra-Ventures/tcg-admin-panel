import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, BackendUser } from '../../services/auth.service';

interface BannedUserRow {
  id: string; // formatted id #U001
  name: string;
  role: string; // Admin/User
  status: string; // Banned/Inactive
  email: string;
  access: string; // Full/Limited
  _numId?: number; // original backend id
  is_banned?: boolean;
}

@Component({
  standalone: true,
  selector: 'app-banned-users-section',
  imports: [CommonModule],
  templateUrl: './usuarios-baneados.component.html',
  styleUrls: ['./usuarios-baneados.component.scss']
})
export class BannedUsersComponent implements OnInit {
  constructor(private auth: AuthService) {}

  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  bannedUsers = signal<BannedUserRow[]>([]);

  // Unban modal state
  showUnbanConfirm = signal(false);
  userToUnban = signal<BannedUserRow | null>(null);
  unbanning = signal(false);
  unbanError = signal<string | null>(null);

  ngOnInit(){ this.loadBanned(); }

  private loadBanned(){
    this.loading.set(true); this.error.set(null);
    this.auth.fetchUsers().subscribe({
      next: (list: BackendUser[]) => {
        const mapped = list.map(u => ({
          id: `#U${u.id.toString().padStart(3,'0')}`,
          name: u.username,
          role: u.is_admin ? 'Admin' : 'User',
            // prefer explicit banned flag; fallback: inactive treated as banned if flag missing
          status: (u as any).is_banned || !u.is_active ? 'Banned' : (u.is_active ? 'Active' : 'Inactive'),
          email: u.email,
          access: u.is_admin ? 'Full' : 'Limited',
          _numId: u.id,
          is_banned: (u as any).is_banned
        }));
        // Filter: if backend supplies is_banned use it, else consider not active
        const filtered = mapped.filter(x => x.is_banned === true || x.status === 'Banned');
        this.bannedUsers.set(filtered);
        this.loading.set(false);
      },
      error: err => { console.error('Error cargando baneados', err); this.error.set('Error cargando usuarios baneados'); this.loading.set(false); }
    });
  }

  // Unban flow
  openUnbanConfirm(u: BannedUserRow){ if (this.unbanning()) return; this.userToUnban.set(u); this.unbanError.set(null); this.showUnbanConfirm.set(true); }
  cancelUnban(){ if (this.unbanning()) return; this.showUnbanConfirm.set(false); this.userToUnban.set(null); }
  confirmUnban(){
    const u = this.userToUnban();
    if (!u || !u._numId) return;
    this.unbanning.set(true); this.unbanError.set(null);
    this.auth.unbanUser(u._numId).subscribe({
      next: () => {
        this.bannedUsers.set(this.bannedUsers().filter(x => x._numId !== u._numId));
        this.unbanning.set(false); this.showUnbanConfirm.set(false); this.userToUnban.set(null);
      },
      error: (err: any) => { console.error('Error desbaneando', err); this.unbanError.set('Error desbaneando usuario'); this.unbanning.set(false); }
    });
  }
}
