export type UserRole = 'guest' | 'client' | 'manager' | 'admin';

export interface UserInfo {
  id: number;
  fullName: string;
  role: UserRole;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  discount_percent: number;
  image_path: string;
  category_id: number;
  manufacturer_id: number;
  category_name: string;
  manufacturer_name: string;
  supplier_id: number;
  supplier_name: string;
}

export interface Supplier {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Manufacturer {
  id: number;
  name: string;
}

export interface Order {
  id: number;
  article: string;
  status_id: number;
  status_name: string;
  pickup_address: string;
  order_date: string;
  issue_date: string;
}

export interface OrderStatus {
  id: number;
  name: string;
}
