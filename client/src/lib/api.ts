import type { Category, Manufacturer, Order, OrderStatus, Product, Supplier, UserInfo } from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

class ApiClient {
  private token: string | null = localStorage.getItem('token');

  setToken(token: string | null): void {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');

    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ message: 'Ошибка запроса' }));
      throw new Error(payload.message ?? 'Ошибка запроса');
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  login(login: string, password: string): Promise<{ token: string; user: UserInfo }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login, password }),
    });
  }

  guest(): Promise<{ user: UserInfo }> {
    return this.request('/auth/guest');
  }

  getProducts(params: URLSearchParams): Promise<Product[]> {
    return this.request(`/products?${params.toString()}`);
  }

  getSuppliers(): Promise<Supplier[]> {
    return this.request('/products/suppliers');
  }

  getProductMeta(): Promise<{
    categories: Category[];
    manufacturers: Manufacturer[];
    suppliers: Supplier[];
  }> {
    return this.request('/products/meta');
  }

  createProduct(payload: object): Promise<{ id: number }> {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  updateProduct(id: number, payload: object): Promise<void> {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  deleteProduct(id: number): Promise<void> {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  getOrders(): Promise<Order[]> {
    return this.request('/orders');
  }

  getOrderStatuses(): Promise<OrderStatus[]> {
    return this.request('/orders/statuses');
  }

  createOrder(payload: object): Promise<{ id: number }> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  updateOrder(id: number, payload: object): Promise<void> {
    return this.request(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  deleteOrder(id: number): Promise<void> {
    return this.request(`/orders/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
