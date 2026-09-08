export interface ProductColor {
  name: string;
  hex: string;
  inStock: boolean;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  gallery: string[];
  description: string;
  shortDescription: string;
  colors: ProductColor[];
  stock: number;
  sku: string;
  isNew?: boolean;
  isFeatured?: boolean;
  specs: ProductSpec[];
  features: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export interface OrderAddress {
  fullName: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  street: string;
  notes?: string;
}

export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  discountAmount: number;
  shippingMethod: string;
  shippingCost: number;
  status: OrderStatus;
  address: OrderAddress;
  paymentMethod: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'order' | 'discount' | 'system';
}

export type UserRole = 'admin' | 'customer' | 'guest';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export type ActivePage =
  | 'home'
  | 'product-detail'
  | 'cart'
  | 'admin'
  | 'categories'
  | 'wishlist'
  | 'contact'
  | 'faq'
  | 'terms'
  | 'tracking'
  | 'admin-login';

export type AdminTab = 'dashboard' | 'orders' | 'wishlist' | 'addresses' | 'messages' | 'settings' | 'inventory';
