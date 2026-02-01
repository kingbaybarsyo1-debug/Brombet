
export interface Product {
  id: string;
  name: string;
  price: number;
  costPrice?: number; // سعر التكلفة
  stock: number;
  category: string;
  minStockAlert: number;
}

export interface InvoiceItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Invoice {
  id: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'mixed';
  paidCash?: number;
  paidCard?: number;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'cashier';
}

export enum AppSection {
  Dashboard = 'dashboard',
  POS = 'pos',
  Invoices = 'invoices',
  Products = 'products',
  Reports = 'reports',
  Users = 'users',
  Settings = 'settings'
}
