import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditProduct } from '../../components/edit-product/edit-product';

interface ProductRow {
  name: string;
  status: 'Activo' | 'Pendiente' | 'Inactivo';
  type: string;
  subtype: string;
  language: string;
  game: string;
  productCode: string;
  published: boolean;
  date: string; // ISO string
}

@Component({
  standalone: true,
  selector: 'app-products-section',
  imports: [CommonModule, EditProduct],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss',
})
export class ProductsComponent {
  products: ProductRow[] = [
    {
      name: 'Booster Box',
      status: 'Activo',
      type: 'Sealed',
      subtype: 'Box',
      language: 'ES',
      game: 'TCG',
      productCode: 'BX-001',
      published: true,
      date: '2025-08-01',
    },
    {
      name: 'Special Packs',
      status: 'Activo',
      type: 'Sealed',
      subtype: 'Pack',
      language: 'EN',
      game: 'TCG',
      productCode: 'PK-045',
      published: true,
      date: '2025-08-03',
    },
    {
      name: 'Ultra Rare Card',
      status: 'Pendiente',
      type: 'Single',
      subtype: 'Rare',
      language: 'EN',
      game: 'TCG',
      productCode: 'CR-777',
      published: false,
      date: '2025-08-05',
    },
  ];

  // Modal state for editing a product
  showEditModal = false;
  selectedProduct: ProductRow | null = null;

  openEditModal(p: ProductRow) {
    this.selectedProduct = p;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.selectedProduct = null;
    this.showEditModal = false;
  }
}
