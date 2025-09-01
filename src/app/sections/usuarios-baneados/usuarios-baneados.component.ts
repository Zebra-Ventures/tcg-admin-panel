import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface BannedUser {
  id: string;
  name: string;
  role: string;
  status: string;
  email: string;
  access: string;
}

@Component({
  standalone: true,
  selector: 'app-banned-users-section',
  imports: [CommonModule],
  templateUrl: './usuarios-baneados.component.html',
  styleUrls: ['./usuarios-baneados.component.scss']
})
export class BannedUsersComponent {
  bannedUsers: BannedUser[] = [
    { id: 'B01', name: 'Luis García', role: 'Viewer', status: 'Banned', email: 'luis@example.com', access: 'None' },
    { id: 'B02', name: 'Ana Torres', role: 'Editor', status: 'Banned', email: 'ana@example.com', access: 'None' },
    { id: 'B03', name: 'Pedro Díaz', role: 'Admin', status: 'Banned', email: 'pedro@example.com', access: 'None' }
  ];
}
