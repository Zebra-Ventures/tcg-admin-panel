import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-settings-section',
  template: `<h2 class="sec-title">Settings</h2>
  <p class="sec-muted">Settings options (placeholder).</p>`,
  styles: [`
    :host { display:block; padding:22px; }
    .sec-title { margin:0 0 10px; font-size:20px; font-weight:600; color:#111827; }
    .sec-muted { margin:0; color:#6b7280; }
  `]
})
export class SettingsComponent {}
