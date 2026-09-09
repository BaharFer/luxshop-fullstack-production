import {
  Product,
  Category,
  Order,
  User,
  ContactMessage,
  OrderStatus,
} from '../types';

const RENDER_API =
  'https://luxshop-fullstack-production.onrender.com/api';

const API_BASE =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname) &&
  window.location.port === '5173'
    ? 'http://localhost:3000/api'
    : RENDER_API;
    
const request = async <T = any>(
  path: string,
  init: RequestInit = {}
): Promise<T> => {
  let res: Response;

  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...(init.headers || {}),
      },
    });
  } catch {
    throw new Error(
      'ارتباط با سرور برقرار نشد. مطمئن شوید PostgreSQL و سرور فروشگاه در حال اجرا هستند.'
    );
  }

  const data = await res.json().catch(() => ({}));

 if (!res.ok || data.success === false) {
  const validationMessage = Array.isArray(data.details)
    ? data.details
        .map((issue: any) => {
          const field = issue.path?.join('.') || 'داده';
          return `${field}: ${issue.message}`;
        })
        .join(' | ')
    : '';

  throw new Error(
    validationMessage ||
      data.message ||
      `خطای سرور (${res.status})`
  );
}

  return data;
};

export const api = {
  // -------------------------
  // Authentication
  // -------------------------

  async login(
    usernameOrPhone: string,
    password: string,
    role?: 'customer' | 'admin'
  ) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        usernameOrPhone,
        password,
        role,
      }),
    });
  },

  async register(
    name: string,
    phone: string,
    password: string,
    email?: string
  ) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        phone,
        password,
        email,
      }),
    });
  },

  async registerAdmin(
    name: string,
    phone: string,
    password: string,
    email?: string,
    adminSecretKey?: string
  ) {
    return request('/auth/admin/register', {
      method: 'POST',
      headers: {
        'x-admin-bootstrap-secret': adminSecretKey || '',
      },
      body: JSON.stringify({
        name,
        phone,
        password,
        email,
      }),
    });
  },

  async getMe(): Promise<{ user: User | null; role: string }> {
    try {
      return await request('/auth/me');
    } catch {
      return {
        user: null,
        role: 'guest',
      };
    }
  },

  async logout() {
    try {
      await request('/auth/logout', {
        method: 'POST',
      });
    } finally {
      // Intentionally empty
    }
  },

  // -------------------------
  // User
  // -------------------------

  async getUserProfile() {
    return request('/user/profile');
  },

  async updateUserProfile(payload: {
    name?: string;
    email?: string;
  }) {
    return request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async getUserOrders(): Promise<Order[]> {
    const data = await request('/user/orders');
    return data.orders || [];
  },

  // -------------------------
  // Admin
  // -------------------------

  async testAdminAccess() {
    try {
      return await request('/admin/test-access');
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        userRole: 'customer/guest',
      };
    }
  },

  async getAdminDashboard() {
    const data = await request('/admin/dashboard');
    return data.stats;
  },

  async getAdminOrders(): Promise<Order[]> {
    const data = await request('/admin/orders');
    return data.orders || [];
  },

  async updateAdminOrderStatus(
    id: string,
    status: OrderStatus
  ) {
    const data = await request(
      `/admin/orders/${id}/status`,
      {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }
    );

    return data.order;
  },

  async createAdminProduct(
    product: Partial<Product>
  ) {
    const data = await request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });

    return data.product;
  },

  async uploadProductImage(
  file: File
): Promise<{ imageUrl: string }> {
  const formData = new FormData();

  formData.append('image', file);

  let res: Response;

  try {
    res = await fetch(
      `${API_BASE}/admin/products/upload-image`,
      {
        method: 'POST',
        credentials: 'include',
        body: formData,
      }
    );
  } catch {
    throw new Error(
      'ارتباط با سرور برقرار نشد. مطمئن شوید سرور فروشگاه در حال اجرا است.'
    );
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data.success === false) {
    throw new Error(
      data.message || `خطای سرور (${res.status})`
    );
  }

  const imageUrl = String(data.imageUrl || '');

  if (!imageUrl) {
    throw new Error('آدرس تصویر از سرور دریافت نشد.');
  }

  const fullImageUrl = imageUrl.startsWith('http')
    ? imageUrl
    : `${window.location.origin}${imageUrl}`;

  return {
    imageUrl: fullImageUrl,
  };
},

  async updateAdminProduct(
    id: string,
    product: Partial<Product>
  ) {
    const data = await request(
      `/admin/products/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(product),
      }
    );

    return data.product;
  },

  async getAdminProducts(): Promise<Product[]> {
    const data = await request('/admin/products');
    return data.products || [];
  },

  async updateAdminStock(
    id: string,
    stock: number
  ) {
    const data = await request(
      `/admin/products/${id}/stock`,
      {
        method: 'PUT',
        body: JSON.stringify({ stock }),
      }
    );

    return data.product;
  },

  async deleteAdminProduct(id: string) {
    await request(`/admin/products/${id}`, {
      method: 'DELETE',
    });

    return true;
  },

  async getAdminUsers(): Promise<User[]> {
    const data = await request('/admin/users');
    return data.users || [];
  },

  async getAdminMessages(): Promise<ContactMessage[]> {
    const data = await request('/admin/messages');
    return data.messages || [];
  },

  // -------------------------
  // Products & Catalog
  // -------------------------

  async getProducts(
    params?: {
      category?: string;
      search?: string;
      sort?: string;
    }
  ): Promise<Product[]> {
    const query = new URLSearchParams();

    Object.entries(params || {}).forEach(([key, value]) => {
      if (value) {
        query.set(key, value);
      }
    });

    const data = await request(
      `/products?${query}`
    );

    return data.products || [];
  },

  async getProductById(
    id: string
  ): Promise<Product> {
    const data = await request(
      `/products/${id}`
    );

    return data.product;
  },

  async getCategories(): Promise<Category[]> {
    const data = await request('/categories');
    return data.categories || [];
  },

  // -------------------------
  // Orders
  // -------------------------

  async getOrders(): Promise<Order[]> {
    const data = await request('/orders');
    return data.orders || [];
  },

  async placeOrder(
    orderData: any
  ): Promise<Order> {
    const data = await request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });

    return data.order;
  },

  async createOrder(orderData: any) {
    return this.placeOrder(orderData);
  },

  async trackOrder(
    query: string
  ): Promise<Order> {
    const data = await request(
      `/orders/track/${encodeURIComponent(query)}`
    );

    return data.order;
  },

  async updateOrderStatus(
    id: string,
    status: OrderStatus
  ) {
    return this.updateAdminOrderStatus(
      id,
      status
    );
  },

  // -------------------------
  // Contact
  // -------------------------

  async sendContactMessage(
    formData: any
  ) {
    return request('/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  },

  async getContactMessages() {
    return this.getAdminMessages();
  },

  // -------------------------
  // Payment
  // -------------------------

  async requestZarinpalPayment(
    orderNumber: string,
    phone: string
  ) {
    return request(
      '/payments/zarinpal/request',
      {
        method: 'POST',
        body: JSON.stringify({
          orderNumber,
          phone,
        }),
      }
    );
  },
};
