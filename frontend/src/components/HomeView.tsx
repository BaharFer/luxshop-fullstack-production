import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  Star,
  Truck,
  ShieldCheck,
  Zap,
  Sparkles,
  Search,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  PhoneCall,
  Mail,
  Send,
  MessageSquare,
  Building2,
  Headphones,
} from 'lucide-react';
import { Product, Category, Order, OrderStatus, FAQItem } from '../types';
import { formatPrice, toPersianDigits } from '../data';
import { api } from '../services/api';

const HOME_FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'سفارش و ارسال',
    question: 'سفارش‌ها چگونه و در چه بازه زمانی ارسال می‌شوند؟',
    answer: 'تمامی سفارش‌های تهران از طریق پیک اکسپرس ظرف ۲۴ ساعت کاری تحویل می‌گردند. برای سایر شهرهای سراسر کشور، مرسوله‌ها با پست پیشتاز یا تیپاکس ارسال شده و بین ۲ الی ۳ روز کاری به مقصد می‌رسند.',
  },
  {
    id: 'faq-2',
    category: 'سفارش و ارسال',
    question: 'آیا امکان پیگیری آنلاین لحظه‌ای وضعیت سفارش وجود دارد؟',
    answer: 'بله، بلافاصله پس از ثبت سفارش، کد پیگیری اختصاصی (مانند #ORD-8932) پیامک می‌شود. شما در همین صفحه در بخش «پیگیری سفارش» می‌توانید کد خود را وارد کرده و وضعیت را استعلام فرمایید.',
  },
  {
    id: 'faq-3',
    category: 'ضمانت و اصالت',
    question: 'آیا کالاهای فروشگاه لوکس دارای گارانتی اصالت هستند؟',
    answer: 'تمامی محصولات عرضه‌شده در فروشگاه لوکس ۱۰۰٪ اورجینال، پلمپ شرکتی و دارای ضمانت اصالت فیزیکی و سلامت هستند. لوازم صوتی و دیجیتال علاوه بر مهلت تست ۷ روزه، دارای گارانتی ۱۸ تا ۲۴ ماهه معتبر می‌باشند.',
  },
  {
    id: 'faq-4',
    category: 'ضمانت و اصالت',
    question: 'شرایط مرجوعی کالا و بازگشت وجه تا ۷ روز به چه صورت است؟',
    answer: 'در صورت هرگونه مغایرت یا نقص فنی، می‌توانید ظرف ۷ روز کالا را در جعبه اصلی مرجوع فرمایید. وجه پرداختی ظرف ۲۴ ساعت کاری به حساب شما عودت داده می‌شود.',
  },
  {
    id: 'faq-5',
    category: 'پرداخت و امنیت',
    question: 'روش‌های پرداخت در فروشگاه لوکس کدامند؟',
    answer: 'پرداخت آنلاین از طریق کلیه کارت‌های بانکی عضو شبکه شتاب با درگاه‌های امن شاپرک صورت می‌گیرد. همچنین برای شهر تهران امکان پرداخت در محل با کارتخوان سیار وجود دارد.',
  },
];

interface HomeViewProps {
  categories: Category[];
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, selectedColor?: string) => void;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (categorySlug: string) => void;
  onOpenVideoModal?: (title: string, poster: string) => void;
  onShowToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  categories,
  products,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onSelectCategory,
  onOpenVideoModal,
  onShowToast,
}) => {
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'newest'>('popular');

  // Order Tracking Section state
  const [trackingQuery, setTrackingQuery] = useState<string>('ORD-8932');
  const [trackingLoading, setTrackingLoading] = useState<boolean>(false);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  // FAQ state
  const [openFaqIds, setOpenFaqIds] = useState<string[]>(['faq-1', 'faq-3']);
  const [faqSearch, setFaqSearch] = useState<string>('');

  // Contact Form state
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('مشاوره خرید محصول');
  const [contactMessage, setContactMessage] = useState('');
  const [contactLoading, setContactLoading] = useState(false);

  // Hero featured product fallback

const heroProduct =
  products.find((p) => p.sku === 'PRO-W') || {
    id: 'hero-headphone',
    title: 'هدفون بی‌سیم پریمیوم پرو',
    slug: 'wireless-headphone-premium-pro',
    category: 'headphones',
    price: 3980000,
    originalPrice: 4500000,
    discountPercent: 11,
    rating: 4.8,
    reviewsCount: 124,
    image: '/assets/products/screen-removebg-preview.webp',
    gallery: ['/assets/products/screen-removebg-preview.webp'],
    shortDescription:
      'تجربه صدایی بی‌نظیر با تکنولوژی حذف نویز هوشمند و طراحی ارگونومیک.',
    description:
      'هدست بی‌سیم حرفه‌ای با حذف نویز فعال هیبریدی.',
    colors: [
      {
        name: 'مشکی مات',
        hex: '#1a1a1a',
        inStock: true,
      },
    ],
    stock: 5,
    sku: 'PRO-W',
    isNew: true,
    isFeatured: true,
    specs: [],
    features: [],
  };

const heroImage = '/assets/products/screen-removebg-preview.webp';

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedFilterCategory !== 'all') {
      list = list.filter((p) => p.category === selectedFilterCategory);
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else {
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return list;
  }, [products, selectedFilterCategory, sortBy]);

  const handleTrackOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trackingQuery.trim()) {
      setTrackingError('لطفاً شماره سفارش یا شماره تماس را وارد فرمایید.');
      return;
    }

    try {
      setTrackingLoading(true);
      setTrackingError(null);
      const foundOrder = await api.trackOrder(trackingQuery);
      setTrackedOrder(foundOrder);
    } catch (err: any) {
      setTrackedOrder(null);
      setTrackingError(err.message || 'سفارشی با این مشخصات یافت نشد.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = HOME_FAQ_DATA.filter(
    (f) =>
      faqSearch.trim() === '' ||
      f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const handleSendContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMessage.trim()) {
      onShowToast('error', 'لطفاً نام و متن پیام را وارد نمایید.');
      return;
    }

    try {
      setContactLoading(true);
      await api.sendContactMessage({
        name: contactName,
        phone: contactPhone,
        email: contactEmail,
        subject: contactSubject,
        message: contactMessage,
      });
      onShowToast('success', 'پیام شما دریافت شد. کارشناسان ما به زودی با شما تماس خواهند گرفت.');
      setContactName('');
      setContactPhone('');
      setContactEmail('');
      setContactMessage('');
    } catch (err: any) {
      onShowToast('error', err.message || 'خطا در ارسال پیام.');
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {/* 1. Asymmetric Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#FAFAF6] to-[#F7F7F2] py-5 sm:py-8 md:py-12 lg:py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          <div className="hero-3d-shell relative overflow-hidden rounded-[28px] sm:rounded-[34px] bg-white/95 border border-[#E2E7E3] p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-[#8BC9A5]/20 blur-3xl pointer-events-none"></div>
            <div className="absolute -right-24 -bottom-24 w-72 h-72 rounded-full bg-[#C5A267]/10 blur-3xl pointer-events-none"></div>
            <div className="relative z-10 flex flex-col-reverse md:flex-row items-start gap-8 sm:gap-10 md:gap-6 lg:gap-16">
            {/* Text Content */}
            <div className="w-full md:w-1/2 text-right space-y-4 sm:space-y-5 lg:space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#8BC9A5]/20 text-[#2F6B5B] rounded-full text-xs sm:text-sm font-bold">
                <Sparkles className="w-4 h-4 text-[#2F6B5B]" />
                <span>تجربه جدید صدای لوکس</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-3xl lg:text-5xl font-black text-[#171A19] leading-[1.3] md:leading-[1.25] tracking-tight">
                صدایی که <br className="hidden sm:inline" />
                <span className="text-[#2F6B5B]">جهان را تغییر می‌دهد</span>
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-[#6B756F] leading-relaxed max-w-xl">
                هدست بی‌سیم حرفه‌ای با حذف نویز هوشمند، درایورهای ۴۰ میلی‌متری تیتانیومی و تا ۷۰ ساعت پخش مداوم موسیقی با یک بار شارژ در فروشگاه لوکس.
              </p>

              {/* Action buttons - easily accessible with full touch targets on mobile */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 sm:pt-3">
                <button
                  id="hero-cta-buy"
                  onClick={() => onAddToCart(heroProduct, heroProduct.colors[0]?.name)}
                  className="w-full sm:w-auto justify-center min-h-[48px] bg-[#2F6B5B] hover:bg-[#255648] text-white px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 group whitespace-nowrap active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>خرید مستقیم محصول</span>
                  <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                </button>

                <button
                  id="hero-cta-details"
                  onClick={() => onSelectProduct(heroProduct)}
                  className="w-full sm:w-auto justify-center min-h-[48px] border border-[#2F6B5B]/30 hover:border-[#2F6B5B] text-[#171A19] hover:text-[#2F6B5B] bg-white hover:bg-[#F7F7F2] px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shadow-xs whitespace-nowrap active:scale-[0.98]"
                >
                  مشاهده جزئیات کامل
                </button>
              </div>

              {/* Feature highlight badges */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 sm:pt-5 border-t border-[#E2E7E3]">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#404943] font-medium">
                  <Truck className="w-4 h-4 text-[#2F6B5B] shrink-0" />
                  <span>ارسال اکسپرس سراسر کشور</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#404943] font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#2F6B5B] shrink-0" />
                  <span>ضمانت اصالت و بازگشت ۷ روزه</span>
                </div>
              </div>
            </div>

            {/* 3D Visual Section */}
            <div className="w-full md:w-1/2 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[#8BC9A5]/25 rounded-3xl blur-3xl transform scale-75 md:scale-95 pointer-events-none"></div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative w-full max-w-[440px] md:max-w-none h-[280px] sm:h-[360px] md:h-[380px] lg:h-[440px] flex items-center justify-center cursor-pointer group rounded-3xl bg-white/70 p-6 sm:p-8 md:p-10 border border-[#E2E7E3]/80 backdrop-blur-sm shadow-sm overflow-visible"
                onClick={() => onSelectProduct(heroProduct)}
              >
                {/* Top Badge: ANC Active Spec */}
                <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-20 bg-[#171A19]/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Zap className="w-3.5 h-3.5 text-[#8BC9A5]" />
                  <span>حذف نویز فعال ANC</span>
                </div>

                <img
  src={heroImage}
  alt={heroProduct.title}
  referrerPolicy="no-referrer"
  className="w-[125%] sm:w-[130%] md:w-[135%] lg:w-[125%] max-w-none h-auto object-contain filter drop-shadow-2xl z-10 relative transform scale-100 group-hover:scale-[1.08] group-hover:-translate-y-3 transition-all duration-700 ease-out"
/>

                {/* Floating Price Badge */}
                <div className="absolute bottom-3.5 right-3.5 sm:bottom-4 sm:right-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl shadow-lg border border-[#E2E7E3] text-right">
                  <div className="text-[10px] text-[#6B756F]">قیمت ویژه فروشگاه لوکس</div>
                  <div className="text-xs sm:text-sm md:text-base font-black text-[#2F6B5B]">
                    {formatPrice(heroProduct.price)}{' '}
                    <span className="text-[11px] font-normal text-[#6B756F]">تومان</span>
                  </div>
                </div>
              </motion.div>
            </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Featured Categories Section with Anchor ID */}
      <section id="categories-section" className="max-w-[1280px] mx-auto px-4 md:px-12 w-full scroll-mt-24">
        <div className="flex justify-between items-end mb-6 md:mb-8">
          <div className="text-right">
            <h2 className="text-2xl md:text-3xl font-black text-[#171A19] mb-1">
              دسته‌بندی‌های برتر
            </h2>
            <p className="text-xs md:text-sm text-[#6B756F]">انتخاب از میان برترین و لوکس‌ترین کالاها</p>
          </div>
          <button
            onClick={() => setSelectedFilterCategory('all')}
            className="hidden md:flex items-center gap-1 text-[#2F6B5B] hover:text-[#8BC9A5] font-bold text-sm transition-colors whitespace-nowrap"
          >
            <span>مشاهده همه</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 md:gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => {
                onSelectCategory(category.slug);
                setSelectedFilterCategory(category.slug);
                const el = document.getElementById('products-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative overflow-hidden rounded-3xl bg-white aspect-square shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-[#E2E7E3]"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-3 right-3 left-3 md:bottom-4 md:right-4 md:left-4 text-right">
                <h3 className="text-white text-sm sm:text-base md:text-xl font-bold mb-0.5">
                  {category.name}
                </h3>
                <span className="text-[11px] text-white/80 flex items-center gap-1 group-hover:text-[#8BC9A5] transition-colors whitespace-nowrap">
                  <span>مشاهده محصولات</span>
                  <ArrowLeft className="w-3 h-3 transform group-hover:-translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Products Grid Section with Anchor ID */}
      <section id="products-section" className="bg-white py-14 md:py-16 border-y border-[#E2E7E3] scroll-mt-24">
        <div className="max-w-[1280px] mx-auto px-4 md:px-12 w-full">
          {/* Header & Filter Tabs */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-5 mb-8 md:mb-10">
            <div className="text-right">
              <div className="inline-flex items-center gap-1 text-xs text-[#2F6B5B] font-bold bg-[#8BC9A5]/20 px-2.5 py-1 rounded-full mb-2">
                <Zap className="w-3.5 h-3.5" /> گلچین محصولات خاص
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-[#171A19]">
                محصولات ویژه فروشگاه لوکس
              </h2>
              <p className="text-xs md:text-sm text-[#6B756F] mt-1">پیشنهادات شگفت‌انگیز با گارانتی معتبر</p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedFilterCategory('all')}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                  selectedFilterCategory === 'all'
                    ? 'bg-[#2F6B5B] text-white shadow-sm'
                    : 'bg-[#F7F7F2] text-[#6B756F] hover:bg-[#E2E7E3]'
                }`}
              >
                همه کالاها
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFilterCategory(cat.slug)}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                    selectedFilterCategory === cat.slug
                      ? 'bg-[#2F6B5B] text-white shadow-sm'
                      : 'bg-[#F7F7F2] text-[#6B756F] hover:bg-[#E2E7E3]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-14 bg-[#F7F7F2] rounded-3xl border border-dashed border-[#E2E7E3]">
              <p className="text-[#6B756F] text-sm">در این دسته‌بندی محصولی یافت نشد.</p>
              <button
                onClick={() => setSelectedFilterCategory('all')}
                className="mt-3 text-xs text-[#2F6B5B] font-bold underline"
              >
                مشاهده همه محصولات
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
              {filteredProducts.map((product) => {
                const isFavorited = wishlistIds.includes(product.id);

                return (
                  <div
                    key={product.id}
                    className="product-card group bg-white rounded-3xl overflow-hidden product-card-shadow border border-[#E2E7E3]/60 relative flex flex-col justify-between"
                  >
                    {/* Top Action Icons */}
                    <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(product.id);
                        }}
                        className={`p-2.5 rounded-full shadow-md backdrop-blur-md transition-all ${
                          isFavorited
                            ? 'bg-[#BA1A1A] text-white'
                            : 'bg-white/90 text-[#6B756F] hover:text-[#BA1A1A] hover:bg-white'
                        }`}
                        title="افزودن به علاقه‌مندی‌ها"
                      >
                        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    {/* Badge */}
                    {product.discountPercent ? (
                      <div className="absolute top-3 right-3 z-20 bg-[#BA1A1A] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                        {product.discountPercent}٪ تخفیف
                      </div>
                    ) : product.isNew ? (
                      <div className="absolute top-3 right-3 z-20 bg-[#8BC9A5] text-[#171A19] text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                        جدید
                      </div>
                    ) : null}

                    {/* Product Image */}
                    <div
                      onClick={() => onSelectProduct(product)}
                      className="relative aspect-square p-6 md:p-8 bg-[#F7F7F2]/60 flex items-center justify-center cursor-pointer overflow-hidden"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="p-5 md:p-6 flex-grow flex flex-col justify-between text-right">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1 text-xs text-[#6B756F]">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="font-bold text-[#171A19]">{product.rating}</span>
                            <span>({product.reviewsCount})</span>
                          </div>
                          <span className="text-[10px] text-[#2F6B5B] bg-[#8BC9A5]/20 px-2 py-0.5 rounded font-mono">
                            {product.sku}
                          </span>
                        </div>

                        <h3
                          onClick={() => onSelectProduct(product)}
                          className="text-base md:text-lg font-bold text-[#171A19] hover:text-[#2F6B5B] transition-colors cursor-pointer line-clamp-1 mb-1"
                        >
                          {product.title}
                        </h3>

                        <p className="text-xs text-[#6B756F] line-clamp-2 leading-relaxed mb-4">
                          {product.shortDescription}
                        </p>
                      </div>

                      {/* Pricing & Add to Cart */}
                      <div className="pt-3 border-t border-[#E2E7E3]/70">
                        <div className="flex items-baseline justify-between mb-3">
                          <div>
                            <div className="text-lg md:text-xl font-bold text-[#2F6B5B]">
                              {formatPrice(product.price)}{' '}
                              <span className="text-xs font-normal text-[#6B756F]">تومان</span>
                            </div>
                            {product.originalPrice && (
                              <div className="text-xs text-gray-400 line-through">
                                {formatPrice(product.originalPrice)} تومان
                              </div>
                            )}
                          </div>

                          <span className="text-[11px] text-[#6B756F]">
                            {product.stock <= 3 ? (
                              <span className="text-[#BA1A1A] font-medium">تنها {product.stock} عدد موجود</span>
                            ) : (
                              <span>موجود در انبار</span>
                            )}
                          </span>
                        </div>

                        <button
                          onClick={() => onAddToCart(product, product.colors[0]?.name)}
                          className="w-full bg-[#8BC9A5] hover:bg-[#2F6B5B] text-[#171A19] hover:text-white py-2.5 sm:py-3 rounded-2xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>افزودن به سبد خرید</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. Order Tracking Section (Interactive Embedded on Home) with Anchor ID */}
      <section id="tracking-section" className="max-w-[1280px] mx-auto px-4 md:px-12 w-full scroll-mt-24">
        <div className="bg-gradient-to-br from-white to-[#F7F7F2] rounded-3xl p-6 md:p-10 border border-[#E2E7E3] shadow-md text-right">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8BC9A5]/20 text-[#2F6B5B] text-xs font-bold">
                <Truck className="w-3.5 h-3.5" />
                <span>پیگیری آنلاین سفارش</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-[#171A19]">
                استعلام وضعیت لحظه‌ای مرسوله
              </h2>
              <p className="text-xs md:text-sm text-[#6B756F]">
                شماره سفارش خود (مانند <code className="font-mono text-[#2F6B5B]">ORD-8932</code> یا <code className="font-mono text-[#2F6B5B]">ORD-8930</code>) یا شماره همراه را وارد کنید.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={trackingQuery}
                  onChange={(e) => setTrackingQuery(e.target.value)}
                  placeholder="شماره سفارش یا شماره تلفن همراه..."
                  className="w-full bg-white border border-[#E2E7E3] rounded-2xl py-3 pr-11 pl-4 text-xs md:text-sm font-bold text-[#171A19] focus:outline-none focus:border-[#2F6B5B] shadow-inner"
                />
                <Search className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                disabled={trackingLoading}
                className="bg-[#2F6B5B] hover:bg-[#255648] text-white px-6 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all shadow whitespace-nowrap flex items-center justify-center gap-1.5"
              >
                <Truck className="w-4 h-4" />
                <span>{trackingLoading ? 'در حال جستجو...' : 'رهگیری مرسوله'}</span>
              </button>
            </form>

            {/* Tracking Error */}
            {trackingError && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{trackingError}</span>
              </div>
            )}

            {/* Tracking Result Card */}
            {trackedOrder && (
              <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#8BC9A5]/40 shadow-md space-y-5 animate-in fade-in zoom-in-95">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E7E3] pb-4">
                  <div>
                    <div className="text-xs text-[#6B756F]">شماره سفارش:</div>
                    <div className="font-mono font-black text-base text-[#2F6B5B]">{trackedOrder.orderNumber}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#6B756F]">تحویل‌گیرنده:</div>
                    <div className="font-bold text-xs md:text-sm text-[#171A19]">{trackedOrder.customerName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#6B756F]">وضعیت کنونی:</div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      trackedOrder.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : trackedOrder.status === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {trackedOrder.status === 'delivered'
                        ? 'تحویل داده شده'
                        : trackedOrder.status === 'shipped'
                        ? 'ارسال شده (در دست پست)'
                        : 'در حال پردازش در انبار'}
                    </span>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-8 h-8 rounded-full bg-[#2F6B5B] text-white flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-[#171A19]">ثبت سفارش</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      trackedOrder.status === 'shipped' || trackedOrder.status === 'delivered'
                        ? 'bg-[#2F6B5B] text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <Truck className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-[#171A19]">تحویل به پست</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      trackedOrder.status === 'delivered'
                        ? 'bg-[#2F6B5B] text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <Package className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-[#171A19]">تحویل به مشتری</span>
                  </div>
                </div>

                <div className="text-xs text-[#6B756F] bg-[#F7F7F2] p-3 rounded-xl flex items-center justify-between">
                  <span>روش ارسال: {trackedOrder.shippingMethod}</span>
                  <span>مبلغ کل: {formatPrice(trackedOrder.totalAmount)} تومان</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. FAQ Section (Interactive Embedded on Home) with Anchor ID */}
      <section id="faq-section" className="max-w-[1280px] mx-auto px-4 md:px-12 w-full scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#8BC9A5]/20 text-[#2F6B5B] text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>پاسخ به سوالات متداول</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#171A19]">
            پرسش‌های متداول مشتریان
          </h2>
          <p className="text-xs md:text-sm text-[#6B756F]">
            پاسخ سریع به متداول‌ترین سوالات درباره رویه ارسال، گارانتی اصالت، و شرایط پرداخت
          </p>

          {/* Quick FAQ Search */}
          <div className="relative max-w-md mx-auto mt-3">
            <input
              type="text"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder="جستجو در پرسش‌ها..."
              className="w-full bg-white border border-[#E2E7E3] rounded-2xl py-2.5 pr-10 pl-4 text-xs text-[#171A19] focus:outline-none focus:border-[#2F6B5B] shadow-sm text-right"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {filteredFaqs.map((item) => {
            const isOpen = openFaqIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E2E7E3] overflow-hidden transition-all duration-200 text-right shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full p-4 md:p-5 flex items-center justify-between gap-4 text-right hover:bg-[#F7F7F2]/50 transition-colors"
                >
                  <span className="font-bold text-xs md:text-sm text-[#171A19]">{item.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#2F6B5B] transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-[#6B756F] leading-relaxed border-t border-[#E2E7E3]/60 bg-[#F7F7F2]/30">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Contact Us Section (Interactive Embedded on Home) with Anchor ID */}
      <section id="contact-section" className="bg-[#FFFFFF] py-14 md:py-16 border-y border-[#E2E7E3] scroll-mt-24">
        <div className="max-w-[1280px] mx-auto px-4 md:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Contact Info (Right side in RTL) */}
            <div className="text-right space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#8BC9A5]/20 text-[#2F6B5B] text-xs font-bold">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>ارتباط مستقیم با کارشناسان</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-[#171A19]">
                  تماس با فروشگاه لوکس
                </h2>
                <p className="text-xs md:text-sm text-[#6B756F] leading-relaxed">
                  تیم پشتیبانی و مشاوره خرید فروشگاه لوکس در ۷ روز هفته آماده پاسخگویی و راهنمایی شماست.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#F7F7F2] border border-[#E2E7E3] space-y-1">
                  <div className="flex items-center gap-2 text-[#2F6B5B] font-bold text-xs">
                    <PhoneCall className="w-4 h-4" />
                    <span>تلفن پشتیبانی</span>
                  </div>
                  <p className="font-mono font-black text-sm text-[#171A19]">۰۲۱-۸۸۸۸۹۹۹۹</p>
                  <p className="text-[11px] text-gray-500">پاسخگویی ۹ الی ۲۱</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F7F2] border border-[#E2E7E3] space-y-1">
                  <div className="flex items-center gap-2 text-[#2F6B5B] font-bold text-xs">
                    <Mail className="w-4 h-4" />
                    <span>پست الکترونیک</span>
                  </div>
                  <p className="font-mono font-bold text-xs text-[#171A19]">support@luxshop.ir</p>
                  <p className="text-[11px] text-gray-500">پاسخ ظرف حداکثر ۲ ساعت</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F7F2] border border-[#E2E7E3] space-y-1 sm:col-span-2">
                  <div className="flex items-center gap-2 text-[#2F6B5B] font-bold text-xs">
                    <MapPin className="w-4 h-4" />
                    <span>دفتر مرکزی و شوروم</span>
                  </div>
                  <p className="text-xs text-[#171A19]">تهران، خیابان ولیعصر، نرسیده به پارک وی، برج لوکس، طبقه ۸</p>
                </div>
              </div>
            </div>

            {/* Contact Form (Left side) */}
            <div className="bg-[#F7F7F2] rounded-3xl p-6 md:p-8 border border-[#E2E7E3] text-right">
              <h3 className="text-base md:text-lg font-bold text-[#171A19] mb-4">
                ارسال پیام یا درخواست مشاوره
              </h3>

              <form onSubmit={handleSendContact} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#171A19] mb-1">
                      نام و نام خانوادگی <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="مثال: سارا محمدی"
                      className="w-full bg-white border border-[#E2E7E3] rounded-xl py-2.5 px-3.5 text-xs text-[#171A19] focus:outline-none focus:border-[#2F6B5B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171A19] mb-1">
                      شماره تماس همراه
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="۰۹۱۲۰۰۰۰۰۰۰"
                      className="w-full bg-white border border-[#E2E7E3] rounded-xl py-2.5 px-3.5 text-xs text-[#171A19] focus:outline-none focus:border-[#2F6B5B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#171A19] mb-1">
                    موضوع پیام
                  </label>
                  <select
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full bg-white border border-[#E2E7E3] rounded-xl py-2.5 px-3.5 text-xs font-medium text-[#171A19] focus:outline-none focus:border-[#2F6B5B]"
                  >
                    <option value="مشاوره خرید محصول">مشاوره خرید محصول</option>
                    <option value="پیگیری سفارش یا گارانتی">پیگیری سفارش یا گارانتی</option>
                    <option value="انتقاد و پیشنهاد">انتقاد و پیشنهاد</option>
                    <option value="همکاری تجاری">همکاری تجاری</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#171A19] mb-1">
                    متن پیام شما <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="پیام یا سوال خود را اینجا بنویسید..."
                    className="w-full bg-white border border-[#E2E7E3] rounded-xl py-2.5 px-3.5 text-xs text-[#171A19] focus:outline-none focus:border-[#2F6B5B] resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={contactLoading}
                  className="w-full py-3 bg-[#2F6B5B] hover:bg-[#255648] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{contactLoading ? 'در حال ارسال پیام...' : 'ارسال پیام به کارشناسان فروشگاه'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Luxury VIP Club / Promo Banner */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-12 w-full pb-8">
        <div className="bg-[#2F6B5B] text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl border border-[#8BC9A5]/30">
          <div className="absolute top-0 left-0 w-80 h-80 bg-[#8BC9A5]/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-xl text-right space-y-5">
            <span className="bg-[#8BC9A5] text-[#171A19] text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider inline-block translate-y-[-2px]">
              باشگاه مشتریان فروشگاه لوکس
            </span>
            <h3 className="text-2xl md:text-4xl font-black leading-tight">
              با عضویت در خبرنامه، ۱۰٪ تخفیف روی اولین خرید دریافت کنید
            </h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              از جدیدترین محصولات و جشنواره‌های اختصاصی فروش قبل از دیگران مطلع شوید.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="email"
                placeholder="شماره موبایل یا ایمیل شما..."
                className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-xs md:text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#8BC9A5] flex-grow text-right"
              />
              <button
                type="button"
                onClick={() => onShowToast('success', 'کد تخفیف ۱۰ درصدی LUX10 برای شما با موفقیت فعال گردید!')}
                className="bg-[#8BC9A5] hover:bg-white text-[#171A19] px-5 py-3 rounded-2xl text-xs md:text-sm font-bold transition-colors whitespace-nowrap shadow"
              >
                دریافت کد تخفیف
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
