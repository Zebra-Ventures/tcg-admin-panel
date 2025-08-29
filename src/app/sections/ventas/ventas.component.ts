import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-sales-section',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.scss'
})
export class SalesComponent {
  sales = [
    { orderId: '#S001', client: 'Juan Perez', seller: 'Admin', qty: 3, amount: 150.50, shipping: 5.90, fee: 3.20, total: 159.60, status: 'Pagado', date: '2025-08-01' },
    { orderId: '#S002', client: 'Maria Lopez', seller: 'Admin', qty: 1, amount: 49.99, shipping: 3.50, fee: 1.10, total: 54.59, status: 'Pendiente', date: '2025-08-02' },
    { orderId: '#S003', client: 'Carlos Ruiz', seller: 'Seller1', qty: 6, amount: 299.00, shipping: 8.00, fee: 6.50, total: 313.50, status: 'Pagado', date: '2025-08-03' },
    { orderId: '#S004', client: 'Lucia Gomez', seller: 'Seller2', qty: 2, amount: 89.00, shipping: 4.50, fee: 2.00, total: 95.50, status: 'Cancelado', date: '2025-08-04' },
    { orderId: '#S005', client: 'Pedro Ramos', seller: 'Admin', qty: 4, amount: 120.00, shipping: 5.00, fee: 2.80, total: 127.80, status: 'Pagado', date: '2025-08-05' }
  ];
}
