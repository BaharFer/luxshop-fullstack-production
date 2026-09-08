import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Play,
  Check,
  ChevronLeft,
  Share2,
  Sparkles,
  MessageSquarePlus,
} from 'lucide-react';
import { Product, Review } from '../types';
import { formatPrice, INITIAL_REVIEWS } from '../data';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
  isFavorited: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, selectedColor: string, quantity: number) => void;
  onSelectProduct: (product: Product) => void;
  onOpenVideoModal: (title: string, poster: string) => void;
  onBackToHome: () => void;
  onShowToast?: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  relatedProducts,
  isFavorited,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onOpenVideoModal,
  onBackToHome,
  onShowToast,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.name || 'پیش‌فرض'
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews' | 'warranty'>('desc');

  // Interactive reviews state
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      userName: newReviewAuthor.trim(),
      rating: newReviewRating,
      date: 'لحظاتی پیش',
      comment: newReviewComment.trim(),
    };

    setReviews([newRev, ...reviews]);
    setNewReviewAuthor('');
    setNewReviewComment('');
    setShowReviewForm(false);
    if (onShowToast) {
      onShowToast('success', 'دیدگاه ارزشمند شما با موفقیت ثبت شد.');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    if (onShowToast) {
      onShowToast('success', 'لینک صفحه محصول با موفقیت کپی شد.');
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs md:text-sm text-[#6B756F]">
        <button
          onClick={onBackToHome}
          className="hover:text-[#2F6B5B] transition-colors"
        >
          خانه
        </button>
        <ChevronLeft className="w-4 h-4 text-gray-400" />
        <span className="capitalize">{product.category}</span>
        <ChevronLeft className="w-4 h-4 text-gray-400" />
        <span className="text-[#171A19] font-semibold truncate max-w-xs">
          {product.title}
        </span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-[#E2E7E3] shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Gallery Column (5 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Active Image Viewport */}
            <div className="relative aspect-square rounded-2xl bg-[#F7F7F2] p-8 flex items-center justify-center border border-[#E2E7E3] overflow-hidden group">
              <motion.img
                key={selectedImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={product.gallery[selectedImageIndex] || product.image}
                alt={product.title}
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
              />

              {/* Badges */}
              {product.discountPercent && (
                <div className="absolute top-4 right-4 bg-[#BA1A1A] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                  {product.discountPercent}٪ تخفیف ویژه
                </div>
              )}

              {/* Wishlist toggle button */}
              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`absolute top-4 left-4 p-3 rounded-full shadow-md backdrop-blur-md transition-all ${
                  isFavorited
                    ? 'bg-[#BA1A1A] text-white'
                    : 'bg-white/90 text-[#6B756F] hover:text-[#BA1A1A] hover:bg-white'
                }`}
                title="افزودن به علاقه‌مندی‌ها"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-white' : ''}`} />
              </button>
            </div>

            {/* Thumbnails Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl bg-[#F7F7F2] p-2 border-2 flex-shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#2F6B5B] shadow-md scale-105'
                      : 'border-[#E2E7E3] hover:border-gray-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} thumbnail ${idx + 1}`}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </button>
              ))}

              {/* Video Lifestyle Thumbnail with Play Overlay */}
              <button
                onClick={() =>
                  onOpenVideoModal(
                    product.title,
                    product.gallery[product.gallery.length - 1] || product.image
                  )
                }
                className="w-20 h-20 rounded-xl bg-[#171A19] relative border-2 border-transparent hover:border-[#8BC9A5] flex-shrink-0 flex items-center justify-center overflow-hidden group shadow-md"
              >
                <img
                  src={product.gallery[product.gallery.length - 1] || product.image}
                  alt="video teaser"
                  className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#8BC9A5] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 text-[#171A19] fill-[#171A19] ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-1 text-[9px] text-white font-bold bg-black/60 px-1.5 rounded">
                  ویدیو
                </span>
              </button>
            </div>
          </div>

          {/* Product Details & Actions Column (7 cols) */}
          <div className="lg:col-span-6 space-y-6 text-right flex flex-col justify-between">
            <div>
              {/* Category, Rating & SKU */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span className="text-sm font-bold text-[#171A19]">{product.rating}</span>
                  </div>
                  <span className="text-xs text-[#6B756F]">({product.reviewsCount} نظر کاربران)</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#2F6B5B] bg-[#8BC9A5]/20 px-2.5 py-1 rounded-md font-mono font-medium">
                    کد کالا: {product.sku}
                  </span>
                  <button
                    onClick={handleCopyLink}
                    className="p-1.5 text-[#6B756F] hover:text-[#171A19] rounded-md hover:bg-[#F7F7F2]"
                    title="اشتراک‌گذاری"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-black text-[#171A19] leading-snug mb-3">
                {product.title}
              </h1>

              {/* Short Description */}
              <p className="text-sm md:text-base text-[#6B756F] leading-relaxed mb-6">
                {product.shortDescription}
              </p>

              {/* Pricing Block */}
              <div className="bg-[#F7F7F2] p-5 rounded-2xl border border-[#E2E7E3] mb-6 flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#6B756F] mb-1">قیمت نهایی برای شما:</div>
                  <div className="text-2xl md:text-3xl font-black text-[#2F6B5B]">
                    {formatPrice(product.price)}{' '}
                    <span className="text-sm font-normal text-[#6B756F]">تومان</span>
                  </div>
                </div>

                {product.originalPrice && (
                  <div className="text-left">
                    <div className="text-xs text-gray-400">قیمت اصلی:</div>
                    <div className="text-sm text-gray-400 line-through">
                      {formatPrice(product.originalPrice)} تومان
                    </div>
                  </div>
                )}
              </div>

              {/* Color Picker */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#171A19]">
                    انتخاب رنگ:{' '}
                    <span className="font-normal text-[#2F6B5B]">{selectedColor}</span>
                  </span>
                  <span className="text-xs text-[#6B756F]">
                    {product.stock <= 3 ? (
                      <span className="text-[#BA1A1A] font-bold">تنها {product.stock} عدد باقی مانده</span>
                    ) : (
                      <span className="text-[#2F6B5B]">موجود در انبار فروشگاه لوکس ({product.stock} عدد)</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${
                          isSelected
                            ? 'border-[#2F6B5B] bg-[#8BC9A5]/15 text-[#2F6B5B] shadow-sm'
                            : 'border-[#E2E7E3] bg-white text-[#171A19] hover:bg-gray-50'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20"
                          style={{ backgroundColor: color.hex }}
                        ></span>
                        <span>{color.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#2F6B5B]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Counter & Add to Cart CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-[#E2E7E3]">
                {/* Quantity Controller */}
                <div className="flex items-center justify-between border border-[#E2E7E3] rounded-xl px-4 py-3 bg-[#F7F7F2] w-full sm:w-36">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="text-lg font-bold text-[#171A19] hover:text-[#2F6B5B] disabled:opacity-30 px-2"
                  >
                    -
                  </button>
                  <span className="font-bold text-[#171A19] text-base">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="text-lg font-bold text-[#171A19] hover:text-[#2F6B5B] disabled:opacity-30 px-2"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add to Cart Button */}
                <button
                  onClick={() => onAddToCart(product, selectedColor, quantity)}
                  className="w-full sm:flex-1 bg-[#2F6B5B] hover:bg-[#8BC9A5] text-white hover:text-[#171A19] py-3.5 px-5 rounded-2xl font-bold text-sm md:text-base transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>افزودن به سبد خرید</span>
                </button>
              </div>
            </div>

            {/* Service & Guarantee Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#E2E7E3] text-center">
              <div className="p-3 bg-[#F7F7F2] rounded-xl">
                <Truck className="w-5 h-5 text-[#2F6B5B] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-[#171A19] block">ارسال رایگان</span>
                <span className="text-[10px] text-[#6B756F]">سراسر کشور</span>
              </div>
              <div className="p-3 bg-[#F7F7F2] rounded-xl">
                <ShieldCheck className="w-5 h-5 text-[#2F6B5B] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-[#171A19] block">ضمانت اصالت</span>
                <span className="text-[10px] text-[#6B756F]">اورجینال ۱۰۰٪</span>
              </div>
              <div className="p-3 bg-[#F7F7F2] rounded-xl">
                <RotateCcw className="w-5 h-5 text-[#2F6B5B] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-[#171A19] block">۷ روز مهلت بازگشت</span>
                <span className="text-[10px] text-[#6B756F]">بی‌قید و شرط</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section (Description, Specs, Reviews, Warranty) */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-[#E2E7E3] shadow-sm">
        {/* Tab Headers */}
        <div className="flex items-center gap-4 border-b border-[#E2E7E3] pb-4 overflow-x-auto text-sm font-bold">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-2 px-2 transition-all whitespace-nowrap ${
              activeTab === 'desc'
                ? 'text-[#2F6B5B] border-b-2 border-[#2F6B5B]'
                : 'text-[#6B756F] hover:text-[#171A19]'
            }`}
          >
            توضیحات محصول
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-2 px-2 transition-all whitespace-nowrap ${
              activeTab === 'specs'
                ? 'text-[#2F6B5B] border-b-2 border-[#2F6B5B]'
                : 'text-[#6B756F] hover:text-[#171A19]'
            }`}
          >
            مشخصات فنی
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2 px-2 transition-all whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'text-[#2F6B5B] border-b-2 border-[#2F6B5B]'
                : 'text-[#6B756F] hover:text-[#171A19]'
            }`}
          >
            نظرات خریداران ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('warranty')}
            className={`pb-2 px-2 transition-all whitespace-nowrap ${
              activeTab === 'warranty'
                ? 'text-[#2F6B5B] border-b-2 border-[#2F6B5B]'
                : 'text-[#6B756F] hover:text-[#171A19]'
            }`}
          >
            گارانتی و ارسال
          </button>
        </div>

        {/* Tab Contents */}
        <div className="pt-8 text-right">
          {activeTab === 'desc' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#171A19]">بررسی تخصصی و ویژگی‌ها</h3>
              <p className="text-[#404943] leading-relaxed text-sm md:text-base">
                {product.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {product.features.map((feat, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3.5 bg-[#F7F7F2] rounded-xl text-sm font-medium text-[#171A19] border border-[#E2E7E3]"
                  >
                    <Sparkles className="w-4 h-4 text-[#2F6B5B] flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#171A19] mb-4">جدول مشخصات فنی</h3>
              <div className="border border-[#E2E7E3] rounded-2xl overflow-hidden divide-y divide-[#E2E7E3]">
                {product.specs.map((spec, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 sm:grid-cols-3 p-4 text-sm hover:bg-[#F7F7F2] transition-colors"
                  >
                    <span className="font-bold text-[#6B756F] sm:col-span-1">{spec.label}</span>
                    <span className="text-[#171A19] font-medium sm:col-span-2 mt-1 sm:mt-0">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#171A19]">دیدگاه خریداران</h3>
                  <p className="text-xs text-[#6B756F] mt-0.5">تجربیات خریداران واقعی این محصول</p>
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-[#2F6B5B] text-white text-xs md:text-sm font-bold px-4 py-2 rounded-xl hover:bg-[#8BC9A5] hover:text-[#171A19] transition-all flex items-center gap-2"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  <span>ثبت دیدگاه جدید</span>
                </button>
              </div>

              {/* Review Submission Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleAddReview}
                  className="bg-[#F7F7F2] p-6 rounded-2xl border border-[#E2E7E3] space-y-4"
                >
                  <h4 className="font-bold text-sm text-[#171A19]">ثبت دیدگاه برای این کالا</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#6B756F] mb-1">نام شما</label>
                      <input
                        type="text"
                        required
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        placeholder="مثال: علی احمدی"
                        className="w-full bg-white border border-[#E2E7E3] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC9A5]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#6B756F] mb-1">امتیاز شما</label>
                      <div className="flex items-center gap-2 pt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReviewRating(star)}
                            className="p-1"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= newReviewRating
                                  ? 'text-amber-500 fill-amber-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#6B756F] mb-1">متن دیدگاه</label>
                    <textarea
                      required
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="نظر خود را درباره کیفیت ساخت، کاربری و صدای محصول بنویسید..."
                      className="w-full bg-white border border-[#E2E7E3] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC9A5]"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      انصراف
                    </button>
                    <button
                      type="submit"
                      className="bg-[#2F6B5B] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#8BC9A5] hover:text-[#171A19] transition-colors"
                    >
                      ارسال نظر
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-[#F7F7F2] border border-[#E2E7E3] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#2F6B5B] text-white font-bold text-xs flex items-center justify-center">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <span className="text-sm font-bold text-[#171A19]">{rev.userName}</span>
                          <span className="text-xs text-[#6B756F] mr-2">• {rev.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-[#404943] leading-relaxed pr-10">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'warranty' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#171A19]">شرایط گارانتی و خدمات پس از فروش</h3>
              <p className="text-sm md:text-base text-[#404943] leading-relaxed">
                کلیه کالاهای ارائه شده در لوکس‌شاپ دارای گارانتی معتبر شرکتی بوده و تحت آزمون‌های دقیق کنترل کیفیت قرار گرفته‌اند.
              </p>
              <ul className="space-y-3 text-sm text-[#171A19]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#2F6B5B]" />
                  <span>۲۴ ماه ضمانت تعویض و خدمات جامع قطعات</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#2F6B5B]" />
                  <span>ارسال فوق سریع در تهران در کمتر از ۳ ساعت با پیک اختصاصی</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#2F6B5B]" />
                  <span>بسته‌بندی ایمن ضد ضربه و پلمپ اصالت کارخانه</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-[#171A19]">محصولات مرتبط و پیشنهادی</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectProduct(item);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white rounded-2xl p-4 border border-[#E2E7E3] hover:border-[#2F6B5B] hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="aspect-square bg-[#F7F7F2] rounded-xl p-4 flex items-center justify-center overflow-hidden mb-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                />
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#171A19] group-hover:text-[#2F6B5B] transition-colors line-clamp-1">
                  {item.title}
                </h4>
                <div className="text-xs text-[#6B756F] mt-1 line-clamp-1">
                  {item.shortDescription}
                </div>
                <div className="text-sm font-bold text-[#2F6B5B] mt-2">
                  {formatPrice(item.price)} تومان
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
