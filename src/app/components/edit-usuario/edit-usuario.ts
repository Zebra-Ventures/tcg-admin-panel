import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface EditableUser {
  id: string; // formatted id (#U001)
  name: string; // username
  role: string; // 'Admin' | 'User'
  status: string; // 'Active' | 'Inactive'
  email: string;
  access: string; // keep for shape compatibility
  _numId?: number; // original numeric backend id
}

@Component({
  selector: 'app-edit-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-usuario.html',
  styleUrl: './edit-usuario.scss'
})
export class EditUsuario {
  @Input() user!: EditableUser; // Provided by parent
  @Output() save = new EventEmitter<EditableUser>();
  @Output() cancelEdit = new EventEmitter<void>();

  submit() {
    if (!this.user) return;
    this.save.emit({ ...this.user });
  }
  cancel() { this.cancelEdit.emit(); }
}
