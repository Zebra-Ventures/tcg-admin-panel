import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-products-section',
  imports: [CommonModule, CurrencyPipe],
  template: `
  <div class="table-toolbar products-toolbar">
    <div class="view-group">
      <div class="view-selector">Products <span class="caret-icon">▾</span></div>
    </div>
    <div class="search-box">
      <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" fill="none"/><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      <input placeholder="Search..." />
    </div>
  </div>

  <div class="data-table">
    <div class="table-header">
      <div>ID</div>
      <div>Name</div>
      <div>Category</div>
      <div>Stock</div>
      <div>Price</div>
      <div>Status</div>
      <div>Actions</div>
    </div>
    <div class="table-body">
      <div class="table-row" *ngFor="let p of products">
        <div class="table-cell text-muted">{{p.id}}</div>
        <div class="table-cell">{{p.name}}</div>
        <div class="table-cell">{{p.category}}</div>
        <div class="table-cell">{{p.stock}}</div>
        <div class="table-cell text-amount">{{p.price | currency:'EUR':'symbol':'1.2-2'}}</div>
        <div class="table-cell">{{p.status}}</div>
        <div class="table-cell">
          <div class="row-actions">
            <div class="action-pill" title="Edit">
              <svg viewBox="0 0 24 24"><path d="M4 20h4l10.5-10.5a1.5 1.5 0 000-2.12L16.62 5.5a1.5 1.5 0 00-2.12 0L4 16v4z"/></svg>
            </div>
            <div class="action-pill" title="Delete">
              <svg viewBox="0 0 24 24"><path d="M5 7h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9 7l1-2h4l1 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="pagination">
    <div class="pagination-button" title="Previous"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
    <div class="pagination-pages"><a class="is-active">1</a><a>2</a><a>3</a><span>…</span><a>9</a></div>
    <div class="pagination-button" title="Next"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
  </div>
  `,
  styles: [`
    :host { display:block; }
    .table-toolbar.products-toolbar { display:grid; grid-template-columns:1fr 200px; gap:14px; padding:16px 22px; align-items:center; }
    .view-group { display:flex; align-items:center; gap:10px; }
    .view-selector { display:flex; align-items:center; gap:8px; background: var(--input,#f3f4f6); border:1px solid #e8eaee; padding:8px 12px; border-radius:8px; min-width:110px; font-weight:500; color:#374151; height:38px; }
    .caret-icon { opacity:.6; }
    .search-box { display:flex; align-items:center; gap:8px; background: var(--input,#f3f4f6); border:1px solid #e8eaee; border-radius:8px; padding:8px 12px; width:200px; justify-self:end; height:38px; }
    .search-box input { all:unset; flex:1; font-size:13px; color:#111827; }
    .search-box svg { width:16px; height:16px; }
    .data-table { margin:6px 22px 20px; border-radius:12px; overflow:hidden; }
    .table-header { background:#3a4350; color:#f9fafb; display:grid; grid-template-columns:160px 1fr 150px 120px 160px 110px 120px; padding:12px 16px; font-size:13px; font-weight:700; }
    .table-body { display:flex; flex-direction:column; gap:12px; background:#fff; padding:12px 0 16px; }
    .table-row { margin:0 12px; background:#f9fafb; border:1px solid var(--border,#e5e7eb); border-radius:12px; padding:12px 8px; display:grid; grid-template-columns:160px 1fr 150px 120px 160px 110px 120px; align-items:center; }
    .table-cell { padding:4px 8px; color:#374151; font-size:13px; }
    .text-muted { color:#6b7280; }
    .text-amount { font-weight:600; }
    .row-actions { display:flex; gap:10px; justify-content:flex-start; }
    .action-pill { width:32px; height:32px; border-radius:999px; display:grid; place-items:center; background:#e8efe6; border:1px solid #d7e4d1; color:#2e7d32; cursor:pointer; transition:transform .06s ease; }
    .action-pill:hover { transform:translateY(-1px); background:#e2ecdf; }
    .action-pill svg { width:16px; height:16px; fill:currentColor; }
    .pagination { display:flex; justify-content:flex-end; align-items:center; gap:14px; padding:8px 22px 24px; color:#374151; }
    .pagination-button { width:28px; height:28px; display:grid; place-items:center; border-radius:999px; background:#e6eaed; color:#111827; cursor:pointer; border:1px solid #d5dae0; }
    .pagination-button svg { width:16px; height:16px; }
    .pagination-pages { display:flex; gap:10px; align-items:center; }
    .pagination-pages a { color:#111827; text-decoration:none; cursor:pointer; }
    .pagination-pages a.is-active { font-weight:700; }
    .pagination-pages span { opacity:.6; }
  `]
})
export class ProductsComponent {
  products = [
    { id: '#P001', name: 'Booster Box', category: 'Sealed', stock: 120, price: 89.9, status: 'Active' },
    { id: '#P002', name: 'Special Packs', category: 'Sealed', stock: 350, price: 4.5, status: 'Active' },
    { id: '#P003', name: 'Ultra Rare Card', category: 'Singles', stock: 5, price: 249.99, status: 'Active' },
  ];
}
