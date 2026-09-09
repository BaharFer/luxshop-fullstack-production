import React, {
  lazy,
  Suspense,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Category, CartItem, Order, OrderStatus, ActivePage, User } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
const HomeView = lazy(() =>
  import('./components/HomeView').then((module) => ({
    default: module.HomeView,
  }))
);

const ProductDetailView = lazy(() =>
  import('./components/ProductDetailView').then((module) => ({
    default: module.ProductDetailView,
  }))
);

const CartCheckoutView = lazy(() =>
  import('./components/CartCheckoutView').then((module) => ({
    default: module.CartCheckoutView,
  }))
);

const AdminDashboardView = lazy(() =>
  import('./components/AdminDashboardView').then((module) => ({
    default: module.AdminDashboardView,
  }))
);

const CategoriesView = lazy(() =>
  import('./components/CategoriesView').then((module) => ({
    default: module.CategoriesView,
  }))
);

const OrderTrackingView = lazy(() =>
  import('./components/OrderTrackingView').then((module) => ({
    default: module.OrderTrackingView,
  }))
);

const FAQView = lazy(() =>
  import('./components/FAQView').then((module) => ({
    default: module.FAQView,
  }))
);

const ContactView = lazy(() =>
  import('./components/ContactView').then((module) => ({
    default: module.ContactView,
  }))
);

const TermsView = lazy(() =>
  import('./components/TermsView').then((module) => ({
    default: module.TermsView,
  }))
);

const AdminAuthView = lazy(() =>
  import('./components/AdminAuthView').then((module) => ({
    default: module.AdminAuthView,
  }))
);
import { SearchModal } from './components/SearchModal';
import { VideoModal } from './components/VideoModal';
import { AuthModal } from './components/AuthModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export function App() {
  // Navigation & Page State
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Auth & User State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalInitialRole, setAuthModalInitialRole] = useState<'customer' | 'admin'>('customer');

  // Real Store State from Express Backend
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingStore, setIsLoadingStore] = useState<boolean>(true);
  const [storeError, setStoreError] = useState<string | null>(null);

  // Cart & Wishlist
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('luxshop_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('luxshop_wishlist');
      return saved ? JSON.parse(saved) : ['headphone-pro', 'smartwatch-x1'];
    } catch {
      return [];
    }
  });

  // Modal & Popup States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [videoModalData, setVideoModalData] = useState<{
    isOpen: boolean;
    title: string;
    poster: string;
  }>({
    isOpen: false,
    title: '',
    poster: '',
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Centralized backend data fetching
  const fetchStoreData = useCallback(async () => {
    setIsLoadingStore(true);
    setStoreError(null);
    try {
      const [fetchedProducts, fetchedCategories] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);

      setProducts(fetchedProducts);
      setCategories(fetchedCategories);

      if (!selectedProduct && fetchedProducts.length > 0) {
        setSelectedProduct(fetchedProducts[0]);
      }
    } catch (err: any) {
      console.error('Failed to load store data from Express API:', err);
      setStoreError(err.message || 'خطا در برقراری ارتباط با سرور فروشگاه.');
    } finally {
      setIsLoadingStore(false);
    }
  }, [selectedProduct]);

  // Fetch orders when user or admin is authenticated
  const fetchOrders = useCallback(async () => {
    try {
      if (currentUser?.role === 'admin') {
        const adminOrders = await api.getAdminOrders();
        setOrders(adminOrders);
      } else if (currentUser) {
        const userOrders = await api.getUserOrders();
        setOrders(userOrders);
      }
    } catch (err) {
      console.warn('Orders fetch error:', err);
    }
  }, [currentUser]);

  // Check auth session on startup and fetch live store data
  useEffect(() => {
    const initApp = async () => {
      try {
        const { user } = await api.getMe();
        if (user) {
          setCurrentUser(user);
        }
      } catch (err) {
        console.warn('Auth check skipped on init:', err);
      }
      await fetchStoreData();
    };
    initApp();
  }, [fetchStoreData]);

  // Sync orders when user or role changes
  useEffect(() => {
    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser, fetchOrders]);

  // Sync client cart & wishlist preferences
  useEffect(() => {
    localStorage.setItem('luxshop_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('luxshop_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  // Smooth scroll handler to sections on home page
  const scrollToSection = (sectionId: string) => {
    if (activePage !== 'home') {
      setActivePage('home');
      setTimeout(() => {
        const targetEl = document.getElementById(sectionId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 120);
    } else {
      const targetEl = document.getElementById(sectionId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleOpenAuthModal = (role: 'customer' | 'admin' = 'customer') => {
    setAuthModalInitialRole(role);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActivePage('admin');
      fetchOrders();
    }
  };

  const handleNavigate = (page: ActivePage | string) => {
    if (page === 'home') {
      setActivePage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'categories') {
      scrollToSection('categories-section');
    } else if (page === 'tracking') {
      scrollToSection('tracking-section');
    } else if (page === 'faq') {
      scrollToSection('faq-section');
    } else if (page === 'contact') {
      scrollToSection('contact-section');
    } else if (page === 'admin-login') {
      handleOpenAuthModal('admin');
    } else if (page === 'admin') {
      if (!currentUser) {
        handleOpenAuthModal('admin');
        return;
      }
      if (currentUser.role !== 'admin') {
        addToast('error', 'دسترسی غیرمجاز.');
        setActivePage('home');
        return;
      }
      fetchOrders();
      setActivePage('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActivePage(page as ActivePage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Product Selection with backend refresh
  const handleSelectProduct = async (product: Product) => {
    setSelectedProduct(product);
    setActivePage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const freshProduct = await api.getProductById(product.id);
      if (freshProduct) {
        setSelectedProduct(freshProduct);
      }
    } catch {
      // Keep optimistic product if offline
    }
  };

  const handleAddToCart = (
    product: Product,
    selectedColor: string = product.colors[0]?.name || 'پیش‌فرض',
    quantity: number = 1
  ) => {
    if (product.stock < quantity) {
      addToast('error', 'موجودی این کالا در انبار کمتر از تعداد درخواستی است.');
      return;
    }

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id && item.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity, selectedColor }];
      }
    });

    addToast('success', `«${product.title}» به سبد خرید افزوده شد.`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    addToast('info', 'کالا از سبد خرید حذف شد.');
  };

  const handleClearCart = () => {
    setCartItems([]);
    addToast('info', 'سبد خرید خالی شد.');
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('info', 'از لیست علاقه‌مندی‌ها حذف شد.');
        return prev.filter((id) => id !== productId);
      } else {
        addToast('success', 'به لیست علاقه‌مندی‌ها اضافه شد.');
        return [...prev, productId];
      }
    });
  };

  // Real Backend Admin Operations
  const handleAddNewProduct = async (newProduct: Product) => {
    try {
      const created = await api.createAdminProduct(newProduct);
      setProducts((prev) => [created, ...prev]);
      addToast('success', 'محصول جدید با موفقیت در پایگاه داده سرور ذخیره شد.');
      fetchStoreData();
    } catch (err: any) {
      addToast('error', err.message || 'خطا در ایجاد محصول در سرور');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const updated = await api.updateAdminOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? updated : o))
      );
      addToast('success', `وضعیت سفارش در پایگاه داده سرور به «${status}» تغییر یافت.`);
    } catch (err: any) {
      addToast('error', err.message || 'خطا در بروزرسانی وضعیت سفارش');
    }
  };

  const handleUpdateStock = async (productId: string, newStock: number) => {
    try {
      const updated = await api.updateAdminStock(productId, newStock);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? updated : p))
      );
      addToast('success', 'موجودی انبار در سرور بروزرسانی شد.');
    } catch (err: any) {
      addToast('error', err.message || 'خطا در بروزرسانی موجودی انبار');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await api.deleteAdminProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addToast('info', 'محصول با موفقیت از پایگاه داده سرور حذف گردید.');
    } catch (err: any) {
      addToast('error', err.message || 'خطا در حذف محصول از سرور');
    }
  };

  const handlePlaceOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Refresh products to reflect decremented inventory
    fetchStoreData();
    addToast('success', 'سفارش شما با موفقیت در سیستم ثبت گردید.');
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setOrders([]);
    addToast('info', 'با موفقیت از حساب کاربری خارج شدید.');
    if (activePage === 'admin' || activePage === 'admin-login') {
      setActivePage('home');
    }
  };

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    if (payment === 'success') {
      window.history.replaceState({}, '', window.location.pathname);
      // The order has already been persisted server-side.
    } else if (payment === 'failed') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F2] text-[#171A19] overflow-x-hidden w-full max-w-full relative">
      {/* Top Navbar */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        cartCount={cartCount}
        wishlistCount={wishlistIds.length}
        onOpenSearch={() => setIsSearchOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
      />

      {/* Main Views Container with Smooth Transitions */}
<main className="flex-grow">
  <Suspense
    fallback={
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-[#2F6B5B] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-sm font-bold text-[#6B756F]">
          در حال بارگذاری صفحه...
        </p>
      </div>
    }
  >
    <AnimatePresence mode="wait">
      {activePage === 'home' && (
        <motion.div
          key="home"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <HomeView
            categories={categories}
            products={products}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
            onSelectCategory={(slug) => {
              scrollToSection('categories-section');
            }}
            onOpenVideoModal={(title, poster) =>
              setVideoModalData({ isOpen: true, title, poster })
            }
            onShowToast={addToast}
          />
        </motion.div>
      )}

            {activePage === 'product-detail' && selectedProduct && (
              <motion.div
                key="detail"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <ProductDetailView
                  product={selectedProduct}
                  relatedProducts={products.filter((p) => p.id !== selectedProduct.id)}
                  isFavorited={wishlistIds.includes(selectedProduct.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={handleAddToCart}
                  onSelectProduct={handleSelectProduct}
                  onOpenVideoModal={(title, poster) =>
                    setVideoModalData({ isOpen: true, title, poster })
                  }
                  onBackToHome={() => handleNavigate('home')}
                  onShowToast={addToast}
                />
              </motion.div>
            )}

            {activePage === 'cart' && (
              <motion.div
                key="cart"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <CartCheckoutView
                  cartItems={cartItems}
                  onUpdateQuantity={handleUpdateCartQuantity}
                  onRemoveItem={handleRemoveCartItem}
                  onClearCart={handleClearCart}
                  onPlaceOrder={handlePlaceOrder}
                  onContinueShopping={() => handleNavigate('home')}
                />
              </motion.div>
            )}

            {activePage === 'admin' && currentUser?.role === 'admin' && (
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <AdminDashboardView
                  orders={orders}
                  products={products}
                  wishlistProducts={wishlistProducts}
                  currentUser={currentUser}
                  onAddNewProduct={handleAddNewProduct}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onUpdateStock={handleUpdateStock}
                  onDeleteProduct={handleDeleteProduct}
                  onSelectProduct={handleSelectProduct}
                  onRemoveFromWishlist={handleToggleWishlist}
                  onAddToCart={handleAddToCart}
                  onLogout={handleLogout}
                  onRefreshData={() => {
                    fetchStoreData();
                    fetchOrders();
                  }}
                />
              </motion.div>
            )}

            {activePage === 'admin-login' && (
              <motion.div
                key="admin-login"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <AdminAuthView
                  onLoginSuccess={handleLoginSuccess}
                  onNavigateHome={() => handleNavigate('home')}
                  onShowToast={addToast}
                />
              </motion.div>
            )}

            {activePage === 'categories' && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <CategoriesView
                  categories={categories}
                  products={products}
                  wishlistIds={wishlistIds}
                  onToggleWishlist={handleToggleWishlist}
                  onSelectProduct={handleSelectProduct}
                  onAddToCart={handleAddToCart}
                />
              </motion.div>
            )}

            {activePage === 'tracking' && (
              <motion.div
                key="tracking"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <OrderTrackingView
                  onNavigateHome={() => handleNavigate('home')}
                  onShowToast={addToast}
                />
              </motion.div>
            )}

            {activePage === 'faq' && (
              <motion.div
                key="faq"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <FAQView onNavigateToContact={() => handleNavigate('contact')} />
              </motion.div>
            )}

            {activePage === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <ContactView onShowToast={addToast} />
              </motion.div>
            )}

            {activePage === 'terms' && (
              <motion.div
                key="terms"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <TermsView />
              </motion.div>
            )}

            {activePage === 'wishlist' && (
              <motion.div
                key="wishlist"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="max-w-[1280px] mx-auto px-4 md:px-12 py-10"
              >
                <div className="flex items-center justify-between mb-8 border-b border-[#E2E7E3] pb-4">
                  <h1 className="text-2xl font-black text-[#171A19]">
                    لیست علاقه‌مندی‌های شما ({wishlistProducts.length})
                  </h1>
                  <button
                    onClick={() => handleNavigate('home')}
                    className="text-xs text-[#2F6B5B] font-bold hover:underline"
                  >
                    بازگشت به فروشگاه
                  </button>
                </div>

                {wishlistProducts.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-[#E2E7E3]">
                    <p className="text-gray-500">هیچ کالایی در لیست علاقه‌مندی شما وجود ندارد.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlistProducts.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl p-4 border border-[#E2E7E3] hover:border-[#2F6B5B] shadow-sm flex flex-col justify-between"
                      >
                        <div
                          onClick={() => handleSelectProduct(item)}
                          className="aspect-square bg-[#F7F7F2] rounded-xl p-4 flex items-center justify-center cursor-pointer mb-3"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </div>
                        <h4
                          onClick={() => handleSelectProduct(item)}
                          className="font-bold text-sm text-[#171A19] hover:text-[#2F6B5B] cursor-pointer"
                        >
                          {item.title}
                        </h4>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="flex-1 bg-[#8BC9A5] hover:bg-[#2F6B5B] text-[#171A19] hover:text-white py-2 rounded-xl text-xs font-bold transition-all"
                          >
                            خرید
                          </button>
                          <button
                            onClick={() => handleToggleWishlist(item.id)}
                            className="px-3 py-2 rounded-xl text-xs text-red-500 hover:bg-red-50"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
            </AnimatePresence>
          </Suspense>
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialRole={authModalInitialRole}
        onLoginSuccess={handleLoginSuccess}
        onShowToast={addToast}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={handleSelectProduct}
        onSelectCategory={(slug) => {
          scrollToSection('categories-section');
        }}
      />

      {/* Video Modal Preview */}
      <VideoModal
        isOpen={videoModalData.isOpen}
        onClose={() => setVideoModalData({ ...videoModalData, isOpen: false })}
        title={videoModalData.title}
        posterImage={videoModalData.poster}
      />

      {/* Toast Feedback Messages */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;