import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-products-section',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductsComponent {
  products = [
    { id: '#P001', name: 'Booster Box', category: 'Sealed', stock: 120, price: 89.9, status: 'Active' },
    { id: '#P002', name: 'Special Packs', category: 'Sealed', stock: 350, price: 4.5, status: 'Active' },
    { id: '#P003', name: 'Ultra Rare Card', category: 'Singles', stock: 5, price: 249.99, status: 'Active' },
  ];
}
