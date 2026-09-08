import React, { useState } from 'react';
import { motion } from 'motion/react';
import { api } from '../services/api';

import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  MapPin,
  Bell,
  Settings,
  LogOut,
  Plus,
  Download,
  Eye,
  TrendingUp,
  Package,
  Users,
  DollarSign,
  AlertTriangle,
  X,
  Edit,
  Trash2,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

import {
  Product,
  Order,
  OrderStatus,
  AdminTab,
  NotificationItem,
  User,
} from '../types';

import {
  formatPrice,
  INITIAL_NOTIFICATIONS,
} from '../data';

interface AdminDashboardViewProps {
  orders: Order[];
  products: Product[];
  wishlistProducts: Product[];
  currentUser?: User | null;

  onAddNewProduct: (product: Product) => void;
  onUpdateOrderStatus: (
    orderId: string,
    status: OrderStatus
  ) => void;

  onUpdateStock: (
    productId: string,
    newStock: number
  ) => void;

  onDeleteProduct?: (productId: string) => void;

  onSelectProduct: (product: Product) => void;

  onRemoveFromWishlist: (
    productId: string
  ) => void;

  onAddToCart: (
    product: Product,
    selectedColor?: string
  ) => void;

  onLogout: () => void;

  onRefreshData?: () => void;
}

export const AdminDashboardView: React.FC<
  AdminDashboardViewProps
> = ({
  orders,
  products,
  wishlistProducts,
  currentUser,
  onAddNewProduct,
  onUpdateOrderStatus,
  onUpdateStock,
  onDeleteProduct,
  onSelectProduct,
  onRemoveFromWishlist,
  onAddToCart,
  onLogout,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] =
    useState<AdminTab>('dashboard');

  const [showNewProductModal, setShowNewProductModal] =
    useState(false);

  const [selectedOrderDetails, setSelectedOrderDetails] =
    useState<Order | null>(null);

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(
      INITIAL_NOTIFICATIONS
    );

  // --------------------------------------------------
  // New Product Form State
  // --------------------------------------------------

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] =
    useState('headphones');

  const [newPrice, setNewPrice] =
    useState<number>(2500000);

  const [newStock, setNewStock] =
    useState<number>(10);

  const [newDescription, setNewDescription] =
    useState('');

  const [newImage, setNewImage] = useState(
  `${window.location.origin}/assets/products/headphone-pro.webp`
);

  const [isUploadingImage, setIsUploadingImage] =
    useState(false);

  const [imageUploadError, setImageUploadError] =
    useState('');

  // --------------------------------------------------
  // Image Upload
  // --------------------------------------------------

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setImageUploadError('');

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      setImageUploadError(
        'فقط تصاویر JPG، PNG و WEBP مجاز هستند.'
      );

      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageUploadError(
        'حجم تصویر نباید بیشتر از ۵ مگابایت باشد.'
      );

      e.target.value = '';
      return;
    }

    try {
      setIsUploadingImage(true);

      const result =
        await api.uploadProductImage(file);

      setNewImage(result.imageUrl);
    } catch (error: any) {
      setImageUploadError(
        error?.message ||
          'آپلود تصویر ناموفق بود.'
      );
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  // --------------------------------------------------
  // Create Product
  // --------------------------------------------------

  const handleCreateProduct = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!newTitle.trim()) {
      return;
    }

    const prod: Product = {
      id: `prod-${Date.now()}`,

      title: newTitle.trim(),

      slug: `custom-${Date.now()}`,

      category: newCategory,

      price: Number(newPrice),

      rating: 5.0,

      reviewsCount: 1,

      image: newImage,

      gallery: [newImage],

      shortDescription:
        newDescription ||
        'محصول جدید با طراحی شکیل و متریال درجه یک',

      description:
        newDescription ||
        'توضیحات تکمیلی محصول جدید افزوده شده به ویترین فروشگاه.',

      colors: [
        {
          name: 'مشکی مات',
          hex: '#1a1a1a',
          inStock: true,
        },
        {
          name: 'نقره‌ای',
          hex: '#d1d5db',
          inStock: true,
        },
      ],

      stock: Number(newStock),

      sku: `PROD-${Math.floor(
        100 + Math.random() * 900
      )}`,

      isNew: true,

      isFeatured: true,

      specs: [
        {
          label: 'گارانتی',
          value: '۱۸ ماهه شرکتی',
        },
        {
          label: 'اصالت',
          value: 'تضمین شده',
        },
      ],

      features: [
        'طراحی ارگونومیک مدرن',
        'متریال لوکس درجه یک',
      ],
    };

    onAddNewProduct(prod);

    setShowNewProductModal(false);

    setNewTitle('');
    setNewDescription('');
  };

  // --------------------------------------------------
  // Export Report
  // --------------------------------------------------

  const handleExportReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'کد سفارش,مشتری,شماره تماس,مبلغ,وضعیت',
      ]
        .concat(
          orders.map(
            (o) =>
              `${o.orderNumber},${o.customerName},${o.customerPhone},${o.totalAmount},${o.status}`
          )
        )
        .join('\n');

    const encodedUri =
      encodeURI(csvContent);

    const link =
      document.createElement('a');

    link.setAttribute(
      'href',
      encodedUri
    );

    link.setAttribute(
      'download',
      'luxury_store_orders_report.csv'
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // --------------------------------------------------
  // Notifications
  // --------------------------------------------------

  const markAllNotifsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  // --------------------------------------------------
  // Dashboard Calculations
  // --------------------------------------------------

  const totalSalesAmount = orders
    .filter(
      (order) =>
        order.status !== 'cancelled'
    )
    .reduce(
      (sum, order) =>
        sum + order.totalAmount,
      0
    );

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ==========================================
            SIDEBAR
        =========================================== */}

        <aside className="lg:col-span-3">
          <div className="bg-white rounded-3xl p-6 border border-[#E2E7E3] shadow-sm space-y-6">

            {/* Profile */}
            <div className="flex items-center gap-3 pb-6 border-b border-[#E2E7E3]">
              <img
                src="/assets/products/smartwatch-x1.webp"
                alt="کاربر"
                className="w-14 h-14 rounded-full object-cover border-2 border-[#8BC9A5] shadow-sm"
              />

              <div>
                <h3 className="font-bold text-sm text-[#171A19]">
                  {currentUser
                    ? currentUser.name
                    : 'علی رضایی'}
                </h3>

                <span className="text-[11px] text-[#2F6B5B] bg-[#8BC9A5]/20 px-2 py-0.5 rounded-md font-medium inline-block mt-0.5">
                  {currentUser?.role === 'admin'
                    ? 'مدیر سیستم'
                    : 'کاربر ویژه فروشگاه'}
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5 pb-2 lg:pb-0 scrollbar-none text-xs sm:text-sm font-medium w-full">

              {/* Dashboard */}
              <button
                onClick={() =>
                  setActiveTab('dashboard')
                }
                className={`flex items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all whitespace-nowrap shrink-0 lg:shrink lg:w-full ${
                  activeTab === 'dashboard'
                    ? 'bg-[#2F6B5B] text-white font-bold shadow-sm'
                    : 'text-[#6B756F] hover:bg-[#F7F7F2] hover:text-[#171A19] bg-gray-50 lg:bg-transparent'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>داشبورد و آمار</span>
              </button>

              {/* Orders */}
              <button
                onClick={() =>
                  setActiveTab('orders')
                }
                className={`flex items-center justify-between gap-2 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all whitespace-nowrap shrink-0 lg:shrink lg:w-full ${
                  activeTab === 'orders'
                    ? 'bg-[#2F6B5B] text-white font-bold shadow-sm'
                    : 'text-[#6B756F] hover:bg-[#F7F7F2] hover:text-[#171A19] bg-gray-50 lg:bg-transparent'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span>سفارش‌ها</span>
                </div>

                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    activeTab === 'orders'
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-[#6B756F]'
                  }`}
                >
                  {orders.length}
                </span>
              </button>

              {/* Wishlist */}
              <button
                onClick={() =>
                  setActiveTab('wishlist')
                }
                className={`flex items-center justify-between gap-2 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all whitespace-nowrap shrink-0 lg:shrink lg:w-full ${
                  activeTab === 'wishlist'
                    ? 'bg-[#2F6B5B] text-white font-bold shadow-sm'
                    : 'text-[#6B756F] hover:bg-[#F7F7F2] hover:text-[#171A19] bg-gray-50 lg:bg-transparent'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <Heart className="w-4 h-4 shrink-0" />
                  <span>علاقه‌مندی‌ها</span>
                </div>

                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    activeTab === 'wishlist'
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-[#6B756F]'
                  }`}
                >
                  {wishlistProducts.length}
                </span>
              </button>

              {/* Messages */}
              <button
                onClick={() =>
                  setActiveTab('messages')
                }
                className={`flex items-center justify-between gap-2 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all whitespace-nowrap shrink-0 lg:shrink lg:w-full ${
                  activeTab === 'messages'
                    ? 'bg-[#2F6B5B] text-white font-bold shadow-sm'
                    : 'text-[#6B756F] hover:bg-[#F7F7F2] hover:text-[#171A19] bg-gray-50 lg:bg-transparent'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <Bell className="w-4 h-4 shrink-0" />
                  <span>پیام‌ها و اعلان‌ها</span>
                </div>

                {notifications.filter(
                  (notification) =>
                    !notification.read
                ).length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#BA1A1A]" />
                )}
              </button>

              {/* Addresses */}
              <button
                onClick={() =>
                  setActiveTab('addresses')
                }
                className={`flex items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all whitespace-nowrap shrink-0 lg:shrink lg:w-full ${
                  activeTab === 'addresses'
                    ? 'bg-[#2F6B5B] text-white font-bold shadow-sm'
                    : 'text-[#6B756F] hover:bg-[#F7F7F2] hover:text-[#171A19] bg-gray-50 lg:bg-transparent'
                }`}
              >
                <MapPin className="w-4 h-4 shrink-0" />
                <span>دفترچه آدرس‌ها</span>
              </button>

              {/* Settings */}
              <button
                onClick={() =>
                  setActiveTab('settings')
                }
                className={`flex items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all whitespace-nowrap shrink-0 lg:shrink lg:w-full ${
                  activeTab === 'settings'
                    ? 'bg-[#2F6B5B] text-white font-bold shadow-sm'
                    : 'text-[#6B756F] hover:bg-[#F7F7F2] hover:text-[#171A19] bg-gray-50 lg:bg-transparent'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>تنظیمات فروشگاه</span>
              </button>
            </nav>

            {/* Logout */}
            <div className="pt-4 border-t border-[#E2E7E3]">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>خروج از حساب</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ==========================================
            MAIN CONTENT
        =========================================== */}

        <main className="lg:col-span-9 space-y-8">

          {/* Top Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-[#E2E7E3] shadow-sm">

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#171A19]">
                  {activeTab === 'dashboard' &&
                    'پنل مدیریت فروشگاه لوکس'}

                  {activeTab === 'orders' &&
                    'لیست تمامی سفارشات'}

                  {activeTab === 'wishlist' &&
                    'کالاهای ذخیره شده در علاقه‌مندی'}

                  {activeTab === 'messages' &&
                    'پیام‌ها و اعلان‌های سیستمی'}

                  {activeTab === 'addresses' &&
                    'آدرس‌های منتخب تحویل سفارش'}

                  {activeTab === 'settings' &&
                    'تنظیمات حساب کاربری و سیستم'}
                </h2>

                {currentUser?.role === 'admin' && (
                  <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md whitespace-nowrap">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    احراز هویت شده ادمین
                  </span>
                )}
              </div>

              <p className="text-xs text-[#6B756F] mt-1">
                مدیریت انبار، به‌روزرسانی تراکنش‌ها و رهگیری زنده پایگاه داده
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col xs:flex-row sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">

              {onRefreshData && (
                <button
                  onClick={onRefreshData}
                  className="flex items-center justify-center gap-1.5 bg-[#F7F7F2] hover:bg-[#E2E7E3] text-[#171A19] px-3.5 py-2.5 rounded-xl text-xs font-bold border border-[#E2E7E3] transition-colors w-full sm:w-auto"
                  title="تازه‌سازی اطلاعات از سرور"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#2F6B5B]" />
                  <span>تازه‌سازی</span>
                </button>
              )}

              <button
                onClick={handleExportReport}
                className="flex items-center justify-center gap-2 bg-[#F7F7F2] hover:bg-[#E2E7E3] text-[#171A19] px-4 py-2.5 rounded-xl text-xs font-bold border border-[#E2E7E3] transition-colors w-full sm:w-auto"
                title="دانلود فایل گزارش اکسل/CSV"
              >
                <Download className="w-4 h-4 text-[#2F6B5B]" />
                <span>خروجی گزارش</span>
              </button>

              <button
                onClick={() =>
                  setShowNewProductModal(true)
                }
                className="flex items-center justify-center gap-2 bg-[#2F6B5B] hover:bg-[#8BC9A5] text-white hover:text-[#171A19] px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md w-full sm:w-auto whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>محصول جدید</span>
              </button>
            </div>
          </div>

          {/* ==========================================
              DASHBOARD TAB
          =========================================== */}

          {activeTab === 'dashboard' && (
            <div className="space-y-8">

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                {/* Sales */}
                <div className="bg-white rounded-2xl p-6 border border-[#E2E7E3] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#6B756F] font-bold">
                      فروش کل سفارش‌ها
                    </span>

                    <div className="w-8 h-8 rounded-lg bg-[#8BC9A5]/20 text-[#2F6B5B] flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="text-2xl font-black text-[#171A19]">
                    {formatPrice(
                      totalSalesAmount || 124500000
                    )}{' '}
                    <span className="text-xs font-normal text-[#6B756F]">
                      تومان
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>
                      +۱۲.۵٪ رشد نسبت به ماه قبل
                    </span>
                  </div>
                </div>

                {/* Orders */}
                <div className="bg-white rounded-2xl p-6 border border-[#E2E7E3] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#6B756F] font-bold">
                      سفارشات ثبت شده
                    </span>

                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="text-2xl font-black text-[#171A19]">
                    {orders.length}{' '}
                    <span className="text-xs font-normal text-[#6B756F]">
                      سفارش
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>
                      همگام‌سازی لحظه‌ای با سرور
                    </span>
                  </div>
                </div>

                {/* Products */}
                <div className="bg-white rounded-2xl p-6 border border-[#E2E7E3] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#6B756F] font-bold">
                      تعداد کالاها در انبار
                    </span>

                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="text-2xl font-black text-[#171A19]">
                    {products.length}{' '}
                    <span className="text-xs font-normal text-[#6B756F]">
                      کالای فعال
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>
                      قفل همزمانی توزیع شده
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-3xl p-6 border border-[#E2E7E3] shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E7E3]">
                  <h3 className="font-bold text-base text-[#171A19]">
                    سفارشات اخیر
                  </h3>

                  <button
                    onClick={() =>
                      setActiveTab('orders')
                    }
                    className="text-xs text-[#2F6B5B] font-bold hover:underline"
                  >
                    مشاهده همه سفارش‌ها
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-[#E2E7E3] text-[#6B756F]">
                        <th className="pb-3 font-bold">
                          کد سفارش
                        </th>

                        <th className="pb-3 font-bold">
                          مشتری
                        </th>

                        <th className="pb-3 font-bold">
                          تاریخ
                        </th>

                        <th className="pb-3 font-bold">
                          مبلغ کل
                        </th>

                        <th className="pb-3 font-bold">
                          وضعیت
                        </th>

                        <th className="pb-3 font-bold text-left">
                          عملیات
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#E2E7E3]">
                      {orders.map((ord) => (
                        <tr
                          key={ord.id}
                          className="hover:bg-[#F7F7F2] transition-colors"
                        >
                          <td className="py-4 font-mono font-bold text-[#171A19]">
                            {ord.orderNumber}
                          </td>

                          <td className="py-4 font-semibold text-[#171A19]">
                            {ord.customerName}
                          </td>

                          <td className="py-4 text-[#6B756F]">
                            {ord.date}
                          </td>

                          <td className="py-4 font-bold text-[#2F6B5B]">
                            {formatPrice(
                              ord.totalAmount
                            )}{' '}
                            تومان
                          </td>

                          <td className="py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                                ord.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : ord.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-700'
                                  : ord.status === 'processing'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {ord.status === 'delivered' &&
                                'تحویل داده شده'}

                              {ord.status === 'shipped' &&
                                'ارسال شده'}

                              {ord.status === 'processing' &&
                                'در حال پردازش'}

                              {ord.status === 'cancelled' &&
                                'لغو شده'}
                            </span>
                          </td>

                          <td className="py-4 text-left">
                            <button
                              onClick={() =>
                                setSelectedOrderDetails(
                                  ord
                                )
                              }
                              className="p-1.5 text-gray-500 hover:text-[#2F6B5B] hover:bg-[#8BC9A5]/20 rounded-lg transition-colors"
                              title="مشاهده جزییات سفارش"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Inventory */}
              <div className="bg-white rounded-3xl p-6 border border-[#E2E7E3] shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E7E3]">
                  <h3 className="font-bold text-base text-[#171A19]">
                    وضعیت موجودی انبار
                  </h3>

                  <span className="text-xs text-[#6B756F]">
                    بروزرسانی لحظه‌ای پایگاه داده
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {products.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-[#F7F7F2] border border-[#E2E7E3] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 bg-white rounded-lg p-1 border border-[#E2E7E3] flex items-center justify-center flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#171A19] line-clamp-1">
                            {item.title}
                          </h4>

                          <span className="text-[10px] text-[#6B756F]">
                            کد: {item.sku}
                          </span>

                          <div className="mt-1">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                item.stock <= 3
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {item.stock <= 3
                                ? `موجودی کم (${item.stock})`
                                : `موجود (${item.stock})`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 items-end flex-shrink-0">
                        <button
                          onClick={() =>
                            onUpdateStock(
                              item.id,
                              item.stock + 5
                            )
                          }
                          className="bg-white hover:bg-[#8BC9A5] text-[#171A19] text-[10px] font-bold px-2.5 py-1 rounded-lg border border-[#E2E7E3] shadow-2xs whitespace-nowrap transition-colors"
                          title="افزایش ۵ عدد به موجودی"
                        >
                          +۵ موجودی
                        </button>

                        {onDeleteProduct && (
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  `آیا از حذف "${item.title}" اطمینان دارید؟`
                                )
                              ) {
                                onDeleteProduct(
                                  item.id
                                );
                              }
                            }}
                            className="text-gray-400 hover:text-red-500 p-1"
                            title="حذف کالا"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              ORDERS TAB
          =========================================== */}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl p-6 border border-[#E2E7E3] shadow-sm space-y-4">
              <h3 className="font-bold text-base text-[#171A19]">
                سفارش‌های ثبت شده
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-[#E2E7E3] text-[#6B756F]">
                      <th className="pb-3 font-bold">
                        کد سفارش
                      </th>

                      <th className="pb-3 font-bold">
                        مشتری
                      </th>

                      <th className="pb-3 font-bold">
                        تعداد اقلام
                      </th>

                      <th className="pb-3 font-bold">
                        مبلغ کل
                      </th>

                      <th className="pb-3 font-bold">
                        روش ارسال
                      </th>

                      <th className="pb-3 font-bold">
                        وضعیت سفارش
                      </th>

                      <th className="pb-3 font-bold text-left">
                        عملیات
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#E2E7E3]">
                    {orders.map((ord) => (
                      <tr
                        key={ord.id}
                        className="hover:bg-[#F7F7F2] transition-colors"
                      >
                        <td className="py-4 font-mono font-bold text-[#171A19]">
                          {ord.orderNumber}
                        </td>

                        <td className="py-4">
                          <div className="font-semibold text-[#171A19]">
                            {ord.customerName}
                          </div>

                          <div className="text-[11px] text-[#6B756F]">
                            {ord.customerPhone}
                          </div>
                        </td>

                        <td className="py-4 font-bold">
                          {ord.items.length} قلم
                        </td>

                        <td className="py-4 font-bold text-[#2F6B5B]">
                          {formatPrice(
                            ord.totalAmount
                          )}{' '}
                          تومان
                        </td>

                        <td className="py-4 text-[#6B756F]">
                          {ord.shippingMethod}
                        </td>

                        <td className="py-4">
                          <select
                            value={ord.status}
                            onChange={(e) =>
                              onUpdateOrderStatus(
                                ord.id,
                                e.target
                                  .value as OrderStatus
                              )
                            }
                            className="bg-[#F7F7F2] border border-[#E2E7E3] text-[11px] font-bold rounded-lg px-2 py-1 focus:ring-1 focus:ring-[#8BC9A5]"
                          >
                            <option value="processing">
                              در حال پردازش
                            </option>

                            <option value="shipped">
                              ارسال شده
                            </option>

                            <option value="delivered">
                              تحویل داده شده
                            </option>

                            <option value="cancelled">
                              لغو شده
                            </option>
                          </select>
                        </td>

                        <td className="py-4 text-left">
                          <button
                            onClick={() =>
                              setSelectedOrderDetails(
                                ord
                              )
                            }
                            className="bg-[#F7F7F2] hover:bg-[#8BC9A5]/20 text-[#2F6B5B] px-3 py-1 rounded-lg text-xs font-bold transition-colors"
                          >
                            جزییات
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==========================================
              WISHLIST TAB
          =========================================== */}

          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              {wishlistProducts.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-[#E2E7E3]">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />

                  <h4 className="font-bold text-sm text-[#171A19]">
                    لیست علاقه‌مندی شما خالی است.
                  </h4>

                  <p className="text-xs text-[#6B756F] mt-1">
                    محصولات مورد علاقه خود را با زدن علامت قلب ذخیره کنید.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {wishlistProducts.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl p-4 border border-[#E2E7E3] shadow-sm flex flex-col justify-between"
                    >
                      <div className="relative aspect-square bg-[#F7F7F2] rounded-xl p-4 flex items-center justify-center overflow-hidden mb-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />

                        <button
                          onClick={() =>
                            onRemoveFromWishlist(
                              item.id
                            )
                          }
                          className="absolute top-2 left-2 p-2 rounded-full bg-white/80 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <h4
                          onClick={() =>
                            onSelectProduct(item)
                          }
                          className="font-bold text-sm text-[#171A19] hover:text-[#2F6B5B] cursor-pointer"
                        >
                          {item.title}
                        </h4>

                        <div className="text-sm font-bold text-[#2F6B5B] mt-2 mb-3">
                          {formatPrice(
                            item.price
                          )}{' '}
                          تومان
                        </div>

                        <button
                          onClick={() =>
                            onAddToCart(
                              item,
                              item.colors[0]?.name
                            )
                          }
                          className="w-full bg-[#8BC9A5] hover:bg-[#2F6B5B] text-[#171A19] hover:text-white py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>افزودن به سبد</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              MESSAGES TAB
          =========================================== */}

          {activeTab === 'messages' && (
            <div className="bg-white rounded-3xl p-6 border border-[#E2E7E3] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E7E3]">
                <h3 className="font-bold text-base text-[#171A19]">
                  پیام‌ها و اعلان‌های سیستمی
                </h3>

                <button
                  onClick={markAllNotifsRead}
                  className="text-xs text-[#2F6B5B] font-bold hover:underline"
                >
                  علامت‌گذاری همه به عنوان خوانده شده
                </button>
              </div>

              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      notification.read
                        ? 'bg-[#F7F7F2] border-[#E2E7E3] opacity-80'
                        : 'bg-[#8BC9A5]/10 border-[#8BC9A5]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {notification.type ===
                          'order' && (
                          <Package className="w-4 h-4 text-[#2F6B5B]" />
                        )}

                        {notification.type ===
                          'system' && (
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                        )}

                        {notification.type ===
                          'discount' && (
                          <DollarSign className="w-4 h-4 text-purple-600" />
                        )}

                        <h4 className="font-bold text-sm text-[#171A19]">
                          {notification.title}
                        </h4>
                      </div>

                      <span className="text-[11px] text-[#6B756F]">
                        {notification.date}
                      </span>
                    </div>

                    <p className="text-xs text-[#404943] mt-2 pr-6">
                      {notification.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==========================================
              ADDRESSES TAB
          =========================================== */}

          {activeTab === 'addresses' && (
            <div className="bg-white rounded-3xl p-6 border border-[#E2E7E3] shadow-sm space-y-6">
              <h3 className="font-bold text-base text-[#171A19]">
                دفترچه نشانی‌ها
              </h3>

              <div className="p-5 rounded-2xl bg-[#F7F7F2] border border-[#E2E7E3] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2F6B5B] bg-[#8BC9A5]/20 px-2 py-0.5 rounded">
                    نشانی پیش‌فرض
                  </span>

                  <div className="flex items-center gap-2">
                    <button className="text-xs text-[#6B756F] hover:text-[#171A19] flex items-center gap-1">
                      <Edit className="w-3.5 h-3.5" />
                      ویرایش
                    </button>
                  </div>
                </div>

                <p className="text-sm font-semibold text-[#171A19]">
                  تهران، خیابان ولیعصر، نرسیده به میدان ونک، کوچه نگین، پلاک ۲۴، واحد ۶
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs text-[#6B756F]">
                  <span>
                    کد پستی: ۱۹۸۷۶۵۴۳۲۱
                  </span>

                  <span>
                    تحویل گیرنده: علی رضایی
                  </span>

                  <span>
                    تماس: ۰۹۱۲۳۴۵۶۷۸۹
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              SETTINGS TAB
          =========================================== */}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl p-6 border border-[#E2E7E3] shadow-sm space-y-6">
              <h3 className="font-bold text-base text-[#171A19]">
                تنظیمات فروشگاه لوکس
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#6B756F] mb-1">
                    نام فروشگاه
                  </label>

                  <input
                    type="text"
                    defaultValue="فروشگاه لوکس"
                    className="w-full bg-[#F7F7F2] border border-[#E2E7E3] rounded-xl px-4 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B756F] mb-1">
                    ایمیل پشتیبانی
                  </label>

                  <input
                    type="email"
                    defaultValue="support@luxstore.ir"
                    className="w-full bg-[#F7F7F2] border border-[#E2E7E3] rounded-xl px-4 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B756F] mb-1">
                    ارز پایه سیستم
                  </label>

                  <input
                    type="text"
                    defaultValue="تومان (IRR)"
                    disabled
                    className="w-full bg-gray-100 border border-[#E2E7E3] rounded-xl px-4 py-2 text-sm text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B756F] mb-1">
                    حداقل خرید برای ارسال رایگان
                  </label>

                  <input
                    type="text"
                    defaultValue="۲,۰۰۰,۰۰۰ تومان"
                    className="w-full bg-[#F7F7F2] border border-[#E2E7E3] rounded-xl px-4 py-2 text-sm"
                  />
                </div>
              </div>

              <button
                onClick={() =>
                  alert(
                    'تنظیمات فروشگاه با موفقیت ذخیره شد.'
                  )
                }
                className="bg-[#2F6B5B] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-[#8BC9A5] hover:text-[#171A19] transition-colors whitespace-nowrap"
              >
                ذخیره تغییرات
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ==============================================
          NEW PRODUCT MODAL
      =============================================== */}

      {showNewProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="bg-white rounded-3xl w-full max-w-lg mx-auto my-4 sm:my-8 p-4 sm:p-6 md:p-8 border border-[#E2E7E3] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#E2E7E3] pb-4">
              <h3 className="font-bold text-base sm:text-lg text-[#171A19] leading-7">
                افزودن محصول جدید به فروشگاه لوکس
              </h3>

              <button
                type="button"
                onClick={() =>
                  setShowNewProductModal(false)
                }
                className="shrink-0 p-2 rounded-xl text-gray-400 hover:text-[#171A19] hover:bg-gray-100 transition-colors"
                aria-label="بستن"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleCreateProduct}
              className="space-y-4 mt-5 text-xs"
            >
              {/* Title */}
              <div>
                <label className="block font-bold text-[#6B756F] mb-1.5">
                  عنوان کامل محصول
                </label>

                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) =>
                    setNewTitle(e.target.value)
                  }
                  placeholder="مثال: ساعت هوشمند لوکس سری اولترا"
                  className="w-full bg-[#F7F7F2] border border-[#E2E7E3] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8BC9A5]"
                />
              </div>

              {/* Category + Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#6B756F] mb-1.5">
                    دسته‌بندی
                  </label>

                  <select
                    value={newCategory}
                    onChange={(e) =>
                      setNewCategory(
                        e.target.value
                      )
                    }
                    className="w-full bg-[#F7F7F2] border border-[#E2E7E3] rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8BC9A5]"
                  >
                    <option value="headphones">
                      هدفون و هندزفری
                    </option>

                    <option value="smartwatch">
                      ساعت هوشمند
                    </option>

                    <option value="perfume">
                      عطر و ادکلن
                    </option>

                    <option value="accessories">
                      اکسسوری
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#6B756F] mb-1.5">
                    قیمت (تومان)
                  </label>

                  <input
                    type="number"
                    required
                    min="0"
                    value={newPrice}
                    onChange={(e) =>
                      setNewPrice(
                        Number(e.target.value)
                      )
                    }
                    className="w-full bg-[#F7F7F2] border border-[#E2E7E3] rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8BC9A5]"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block font-bold text-[#6B756F] mb-1.5">
                  تعداد موجودی اولیه انبار
                </label>

                <input
                  type="number"
                  required
                  min="0"
                  value={newStock}
                  onChange={(e) =>
                    setNewStock(
                      Number(e.target.value)
                    )
                  }
                  className="w-full bg-[#F7F7F2] border border-[#E2E7E3] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8BC9A5]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-[#6B756F] mb-1.5">
                  توضیحات کوتاه
                </label>

                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) =>
                    setNewDescription(
                      e.target.value
                    )
                  }
                  placeholder="ویژگی‌های برجسته محصول..."
                  className="w-full bg-[#F7F7F2] border border-[#E2E7E3] rounded-xl p-3 text-sm outline-none resize-none focus:ring-2 focus:ring-[#8BC9A5]"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                <label className="block font-bold text-[#6B756F]">
                  تصویر محصول
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                  className="block w-full min-w-0 text-xs sm:text-sm text-gray-600
                    file:mr-2 sm:file:mr-3
                    file:rounded-xl
                    file:border-0
                    file:bg-[#2F6B5B]
                    file:px-3 sm:file:px-4
                    file:py-2
                    file:text-white
                    file:font-bold
                    hover:file:bg-[#8BC9A5]
                    hover:file:text-[#171A19]
                    cursor-pointer
                    disabled:opacity-50"
                />

                <p className="text-[10px] sm:text-[11px] text-gray-400 leading-5">
                  فرمت‌های مجاز: JPG، PNG، WEBP — حداکثر ۵ مگابایت
                </p>

                {isUploadingImage && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="w-3.5 h-3.5 border-2 border-gray-300 border-t-[#2F6B5B] rounded-full animate-spin" />

                    <span>
                      در حال آپلود تصویر...
                    </span>
                  </div>
                )}

                {imageUploadError && (
                  <p className="text-sm text-red-500 leading-6">
                    {imageUploadError}
                  </p>
                )}

                {newImage && (
                  <div className="mt-3">
                    <img
                      src={newImage}
                      alt="پیش‌نمایش تصویر محصول"
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover border border-[#E2E7E3]"
                    />
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4 border-t border-[#E2E7E3]">
                <button
                  type="button"
                  onClick={() =>
                    setShowNewProductModal(false)
                  }
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  انصراف
                </button>

                <button
                  type="submit"
                  disabled={isUploadingImage}
                  className="w-full sm:w-auto bg-[#2F6B5B] hover:bg-[#8BC9A5] text-white hover:text-[#171A19] px-6 py-2.5 rounded-xl font-bold transition-all shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ثبت و انتشار محصول
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ==============================================
          ORDER DETAILS MODAL
      =============================================== */}

      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="bg-white rounded-3xl w-full max-w-lg mx-auto my-4 sm:my-8 p-4 sm:p-6 md:p-8 border border-[#E2E7E3] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#E2E7E3] pb-4">
              <div className="min-w-0">
                <h3 className="font-bold text-base text-[#171A19]">
                  جزئیات سفارش{' '}
                  {selectedOrderDetails.orderNumber}
                </h3>

                <span className="text-xs text-[#6B756F]">
                  {selectedOrderDetails.date}
                </span>
              </div>

              <button
                onClick={() =>
                  setSelectedOrderDetails(null)
                }
                className="shrink-0 p-2 rounded-xl text-gray-400 hover:text-[#171A19] hover:bg-gray-100 transition-colors"
                aria-label="بستن"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Information */}
            <div className="space-y-4 text-xs mt-5">
              <div className="bg-[#F7F7F2] p-4 rounded-xl space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-[#6B756F]">
                    نام خریدار:
                  </span>

                  <span className="font-bold text-[#171A19]">
                    {selectedOrderDetails.customerName}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-[#6B756F]">
                    شماره تماس:
                  </span>

                  <span className="font-bold text-[#171A19]">
                    {selectedOrderDetails.customerPhone}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-[#6B756F]">
                    نشانی تحویل:
                  </span>

                  <span className="font-bold text-[#171A19] sm:max-w-xs sm:text-left leading-6">
                    {selectedOrderDetails.address.street}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-[#6B756F]">
                    شیوه پرداخت:
                  </span>

                  <span className="font-bold text-[#2F6B5B]">
                    {selectedOrderDetails.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-[#171A19]">
                  اقلام سفارش:
                </h4>

                {selectedOrderDetails.items.map(
                  (item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-2.5 rounded-xl border border-[#E2E7E3]"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-10 h-10 object-contain shrink-0"
                        />

                        <div className="min-w-0">
                          <div className="font-bold text-[#171A19] line-clamp-1">
                            {item.product.title}
                          </div>

                          <div className="text-[10px] text-[#6B756F]">
                            {item.quantity} عدد •{' '}
                            {item.selectedColor}
                          </div>
                        </div>
                      </div>

                      <div className="font-bold text-[#2F6B5B] shrink-0">
                        {formatPrice(
                          item.product.price *
                            item.quantity
                        )}{' '}
                        تومان
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Total */}
              <div className="border-t border-[#E2E7E3] pt-3 flex flex-col sm:flex-row sm:justify-between gap-2 font-bold text-sm">
                <span>
                  مبلغ نهایی پرداختی:
                </span>

                <span className="text-[#2F6B5B]">
                  {formatPrice(
                    selectedOrderDetails.totalAmount
                  )}{' '}
                  تومان
                </span>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={() =>
                setSelectedOrderDetails(null)
              }
              className="w-full mt-5 bg-[#2F6B5B] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#8BC9A5] hover:text-[#171A19] transition-colors whitespace-nowrap"
            >
              بستن پنجره
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};