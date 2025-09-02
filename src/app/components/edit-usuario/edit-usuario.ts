import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface EditableUser {
  id: string;
  name: string;
  role: string;
  status: string;
  email: string;
  access: string;
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
