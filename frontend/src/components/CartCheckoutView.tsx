import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Trash2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  Plus,
  Minus,
  Tag,
  MapPin,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { CartItem, Order, OrderAddress } from '../types';
import { formatPrice } from '../data';
import { api } from '../services/api';

interface CartCheckoutViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (order: Order) => void;
  onContinueShopping: () => void;
  onNavigateTracking?: (orderNumber: string) => void;
}

export const CartCheckoutView: React.FC<CartCheckoutViewProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
  onContinueShopping,
  onNavigateTracking,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1); // 1: Cart, 2: Address, 3: Shipping, 4: Payment, 5: Success
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Address State
  const [address, setAddress] = useState<OrderAddress>({
    fullName: 'علی رضایی',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    province: 'تهران',
    city: 'تهران',
    postalCode: '۱۹۸۷۶۵۴۳۲۱',
    street: 'خیابان ولیعصر، بالاتر از میدان ونک، کوچه نگین، پلاک ۲۴، واحد ۶',
    notes: '',
  });

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<{
    id: string;
    name: string;
    cost: number;
    time: string;
  }>({
    id: 'express',
    name: 'پست پیشتاز (رایگان)',
    cost: 0,
    time: '۲ الی ۳ روز کاری',
  });

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<string>('cod');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Totals calculation
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingMethod.cost);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'LUX10' || couponCode.trim() === 'لوکس') {
      setDiscountPercent(10);
      setCouponApplied(true);
      alert('کد تخفیف ۱۰ درصدی با موفقیت اعمال شد.');
    } else {
      alert('کد تخفیف وارد شده معتبر نیست. کد تست: LUX10');
    }
  };

  const handleCompletePayment = async () => {
    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      // Call backend API with concurrency-safe inventory reduction & lock
      const newOrder = await api.createOrder({
        customerName: address.fullName,
        customerPhone: address.phone,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
        })),
        discountAmount: discountAmount,
        shippingMethod: shippingMethod.id,
        couponCode: couponApplied ? couponCode.trim() : undefined,
        address: { ...address },
        paymentMethod: paymentMethod as 'saman'|'mellat'|'zarinpal'|'cod',
      });

      if (paymentMethod === 'zarinpal') {
        const payment = await api.requestZarinpalPayment(newOrder.orderNumber, address.phone);
        window.location.href = payment.paymentUrl;
        return;
      }
      onPlaceOrder(newOrder);
      setCompletedOrder(newOrder);
      setCurrentStep(5);
      onClearCart();
    } catch (err: any) {
      setPaymentError(err.message || 'خطا در ثبت سفارش. موجودی کالا بررسی شد.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Step names
  const steps = [
    { number: 1, title: 'سبد خرید' },
    { number: 2, title: 'اطلاعات ارسال' },
    { number: 3, title: 'روش تحویل' },
    { number: 4, title: 'پرداخت' },
    { number: 5, title: 'تایید نهایی' },
  ];

  if (cartItems.length === 0 && currentStep !== 5) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-16 text-center">
        <div className="bg-white rounded-3xl p-12 max-w-lg mx-auto border border-[#E2E7E3] shadow-sm space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#F7F7F2] text-[#6B756F] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#171A19]">سبد خرید شما خالی است!</h2>
          <p className="text-sm text-[#6B756F]">
            می‌توانید برای مشاهده کالاهای فاخر و افزودن آن‌ها به سبد خرید، به صفحه اصلی فروشگاه لوکس بازگردید.
          </p>
          <button
            onClick={onContinueShopping}
            className="bg-[#2F6B5B] hover:bg-[#8BC9A5] text-white hover:text-[#171A19] px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md mt-4 whitespace-nowrap"
          >
            مشاهده و خرید محصولات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-8 space-y-8">
      {/* 1. Multi-Step Progress Tracker */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E2E7E3] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between max-w-3xl mx-auto relative px-2">
          {/* Connector Line */}
          <div className="absolute top-4 sm:top-5 right-4 left-4 h-0.5 bg-[#E2E7E3] -translate-y-1/2 z-0"></div>

          {steps.map((step) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;

            return (
              <div
                key={step.number}
                className="relative z-10 flex flex-col items-center gap-1 sm:gap-2"
              >
                <div
                  className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all ${
                    isCompleted
                      ? 'bg-[#2F6B5B] text-white'
                      : isCurrent
                      ? 'bg-[#8BC9A5] text-[#171A19] ring-2 sm:ring-4 ring-[#8BC9A5]/30'
                      : 'bg-[#F7F7F2] text-gray-400 border border-[#E2E7E3]'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5" /> : step.number}
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-semibold whitespace-nowrap text-center ${
                    isCurrent ? 'text-[#2F6B5B] font-bold' : 'text-[#6B756F]'
                  } ${!isCurrent ? 'hidden sm:block' : 'block'}`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Contents */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Table List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-[#E2E7E3] shadow-sm divide-y divide-[#E2E7E3]">
              <div className="pb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#171A19]">
                  اقلام موجود در سبد خرید ({cartItems.length})
                </h2>
                <button
                  onClick={onClearCart}
                  className="text-xs text-red-500 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> خالی کردن سبد
                </button>
              </div>

              {cartItems.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}`}
                  className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-[#F7F7F2] rounded-xl p-2 flex items-center justify-center border border-[#E2E7E3] flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#171A19]">
                        {item.product.title}
                      </h4>
                      <p className="text-xs text-[#6B756F] mt-1">
                        رنگ: <span className="text-[#2F6B5B] font-medium">{item.selectedColor}</span>
                      </p>
                      <div className="text-sm font-bold text-[#2F6B5B] mt-2">
                        {formatPrice(item.product.price)} تومان
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0">
                    {/* Quantity Controller */}
                    <div className="flex items-center border border-[#E2E7E3] rounded-lg bg-[#F7F7F2]">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                        }
                        className="p-1.5 hover:text-[#2F6B5B]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-[#171A19]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="p-1.5 hover:text-[#2F6B5B]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total Item Price */}
                    <div className="text-left font-bold text-sm text-[#171A19]">
                      {formatPrice(item.product.price * item.quantity)} تومان
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      title="حذف از سبد"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code Input Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E7E3] shadow-sm">
              <form onSubmit={handleApplyCoupon} className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-grow w-full">
                  <Tag className="w-4 h-4 text-[#6B756F] absolute top-3.5 right-3.5" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="کد تخفیف دارید؟ (مثال: LUX10)"
                    className="w-full bg-[#F7F7F2] border border-[#E2E7E3] rounded-xl pr-10 pl-4 py-2.5 text-xs text-[#171A19] focus:outline-none focus:ring-2 focus:ring-[#8BC9A5]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#2F6B5B] hover:bg-[#8BC9A5] text-white hover:text-[#171A19] px-5 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
                >
                  اعمال تخفیف
                </button>
              </form>
              {couponApplied && (
                <div className="mt-2 text-xs text-green-600 font-medium">
                  ✓ تخفیف ۱۰ درصدی فعال گردید.
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-6 border border-[#E2E7E3] shadow-sm space-y-5 sticky top-24">
              <h3 className="font-bold text-base text-[#171A19] border-b border-[#E2E7E3] pb-3">
                خلاصه پیش‌فاکتور
              </h3>

              <div className="space-y-3 text-xs text-[#6B756F]">
                <div className="flex justify-between">
                  <span>مجموع ارزش کالاها:</span>
                  <span className="text-[#171A19] font-bold">{formatPrice(subtotal)} تومان</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>تخفیف ویژه:</span>
                    <span>-{formatPrice(discountAmount)} تومان</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>هزینه بسته‌بندی و ارسال:</span>
                  <span className="text-[#2F6B5B] font-bold">
                    {shippingMethod.cost === 0 ? 'رایگان' : `${formatPrice(shippingMethod.cost)} تومان`}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#E2E7E3] pt-4 flex items-baseline justify-between">
                <span className="font-bold text-sm text-[#171A19]">مبلغ قابل پرداخت:</span>
                <span className="font-black text-xl text-[#2F6B5B]">
                  {formatPrice(totalAmount)}{' '}
                  <span className="text-xs font-normal text-[#6B756F]">تومان</span>
                </span>
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                className="w-full bg-[#2F6B5B] hover:bg-[#8BC9A5] text-white hover:text-[#171A19] py-3 rounded-2xl text-xs md:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>ادامه جهت تکمیل سفارش</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-[#6B756F] text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#2F6B5B]" />
                <span>ضمانت بازگشت وجه و ارسال فوری</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Shipping Address */}
      {currentStep === 2 && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#E2E7E3] shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2E7E3] pb-4">
            <h3 className="text-xl font-bold text-[#171A19] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#2F6B5B]" /> اطلاعات و نشانی تحویل‌گیرنده
            </h3>
            <button
              onClick={() => setCurrentStep(1)}
              className="text-xs text-[#2F6B5B] hover:underline"
            >
              بازگشت به سبد خرید
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#6B756F] mb-1">نام و نام خانوادگی</label>
              <input
                type="text"
                value={address.fullName}
                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                className="w-full bg-[#F7F7F2] border border-[#E2E7E3] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#8BC9A5]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6B756F] mb-1">شماره تماس همراه</label>
              <input
                type="tel"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                className="w-full bg-[#F7F7F2] border border-[#E2E7E3] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#8BC9A5]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6B756F] mb-1">استان</label>
              <input
                type="text"
                value={address.province}
                onChange={(e) => setAddress({ ...address, province: e.target.value })}
                className="w-full bg-[#F7F7F2] border border-[#E2E7E3] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#8BC9A5]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6B756F] mb-1">شهر</label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full bg-[#F7F7F2] border border-[#E2E7E3] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#8BC9A5]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#6B756F] mb-1">کد پستی ۱۰ رقمی</label>
              <input
                type="text"
                value={address.postalCode}
                onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                className="w-full bg-[#F7F7F2] border border-[#E2E7E3] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#8BC9A5]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#6B756F] mb-1">آدرس کامل پستی</label>
              <textarea
                rows={3}
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="w-full bg-[#F7F7F2] border border-[#E2E7E3] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#8BC9A5]"
              ></textarea>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E2E7E3]">
            <button
              onClick={() => setCurrentStep(1)}
              className="text-xs text-[#6B756F] hover:text-[#171A19] font-bold"
            >
              مرحله قبل
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="bg-[#2F6B5B] hover:bg-[#8BC9A5] text-white hover:text-[#171A19] px-6 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all shadow whitespace-nowrap"
            >
              انتخاب شیوه ارسال
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Shipping Method */}
      {currentStep === 3 && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#E2E7E3] shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-[#171A19] flex items-center gap-2 border-b border-[#E2E7E3] pb-4">
            <Truck className="w-5 h-5 text-[#2F6B5B]" /> روش ارسال سفارش
          </h3>

          <div className="space-y-4">
            {[
              {
                id: 'express',
                name: 'پست پیشتاز (رایگان)',
                cost: 0,
                time: '۲ الی ۳ روز کاری',
                desc: 'مناسب برای سراسر ایران با رهگیری آنلاین پیامکی',
              },
              {
                id: 'courier',
                name: 'پیک اختصاصی فروشگاه لوکس',
                cost: 45000,
                time: 'تحویل امروز تا ساعت ۲۱',
                desc: 'مخصوص مناطق ۲۲ گانه تهران با امکان هماهنگی ساعت تحویل',
              },
              {
                id: 'tipax',
                name: 'تیپاکس فوری',
                cost: 35000,
                time: '۲۴ ساعته',
                desc: 'ارسال فوری درب منزل با بیمه کامل مرسوله',
              },
            ].map((method) => {
              const isSelected = shippingMethod.id === method.id;
              return (
                <div
                  key={method.id}
                  onClick={() => setShippingMethod(method)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-[#2F6B5B] bg-[#8BC9A5]/10 shadow-sm'
                      : 'border-[#E2E7E3] hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-[#2F6B5B] bg-[#2F6B5B]' : 'border-gray-400'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#171A19]">{method.name}</h4>
                      <p className="text-xs text-[#6B756F] mt-0.5">{method.desc}</p>
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#2F6B5B] mt-1 font-medium">
                        <Clock className="w-3 h-3" /> زمان تحویل: {method.time}
                      </span>
                    </div>
                  </div>

                  <div className="font-bold text-sm text-[#2F6B5B]">
                    {method.cost === 0 ? 'رایگان' : `${formatPrice(method.cost)} تومان`}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E2E7E3]">
            <button
              onClick={() => setCurrentStep(2)}
              className="text-xs text-[#6B756F] hover:text-[#171A19] font-bold"
            >
              مرحله قبل
            </button>

            <button
              onClick={() => setCurrentStep(4)}
              className="bg-[#2F6B5B] hover:bg-[#8BC9A5] text-white hover:text-[#171A19] px-6 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all shadow whitespace-nowrap"
            >
              ادامه به مرحله پرداخت
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Payment Gateway */}
      {currentStep === 4 && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#E2E7E3] shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-[#171A19] flex items-center gap-2 border-b border-[#E2E7E3] pb-4">
            <CreditCard className="w-5 h-5 text-[#2F6B5B]" /> درگاه پرداخت اینترنتی شاپرک
          </h3>

          {/* Payment Error if concurrency conflict or out of stock */}
          {paymentError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">خطا در انجام پرداخت</p>
                <p className="mt-0.5">{paymentError}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {[
              {
                id: 'zarinpal',
                title: 'زرین‌پال (درگاه آنلاین)',
                subtitle: 'اتصال آماده به API زرین‌پال؛ برای تست می‌توانید Sandbox را فعال کنید',
              },
              {
                id: 'saman',
                title: 'درگاه پرداخت امن سامان (کلیه کارت‌های عضو شتاب)',
                subtitle: 'پرداخت سریع با رمز دوم پویا و ضریب امنیت ۱۰۰٪',
              },
              {
                id: 'mellat',
                title: 'درگاه پرداخت بانک ملت (به پرداخت)',
                subtitle: 'پشتیبانی از تمامی کارت‌های بانکی کشور',
              },
              {
                id: 'cod',
                title: 'پرداخت در محل (کارتخوان سیار)',
                subtitle: 'تسویه همزمان با دریافت کالا درب منزل',
              },
            ].map((gw) => {
              const isSelected = paymentMethod === gw.id;
              return (
                <div
                  key={gw.id}
                  onClick={() => setPaymentMethod(gw.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-[#2F6B5B] bg-[#8BC9A5]/10 shadow-sm'
                      : 'border-[#E2E7E3] hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-[#2F6B5B] bg-[#2F6B5B]' : 'border-gray-400'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#171A19]">{gw.title}</div>
                      <div className="text-xs text-[#6B756F]">{gw.subtitle}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payment Summary Box */}
          <div className="bg-[#F7F7F2] p-4 rounded-2xl border border-[#E2E7E3] flex items-center justify-between">
            <span className="text-sm font-bold text-[#171A19]">مبلغ نهایی تراکنش:</span>
            <span className="text-xl font-black text-[#2F6B5B]">
              {formatPrice(totalAmount)} تومان
            </span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E2E7E3]">
            <button
              onClick={() => setCurrentStep(3)}
              className="text-xs text-[#6B756F] hover:text-[#171A19] font-bold"
            >
              مرحله قبل
            </button>

            <button
              onClick={handleCompletePayment}
              disabled={isProcessingPayment}
              className="bg-[#2F6B5B] hover:bg-[#8BC9A5] text-white hover:text-[#171A19] px-6 py-3.5 rounded-2xl text-xs md:text-sm font-bold transition-all shadow-md flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
              {isProcessingPayment ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>در حال بررسی موجودی و اتصال به شاپرک...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>تکمیل پرداخت و ثبت نهایی سفارش</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Final Order Receipt / Success */}
      {currentStep === 5 && completedOrder && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto bg-white rounded-3xl p-8 md:p-10 border border-[#E2E7E3] shadow-lg text-center space-y-6"
        >
          <div className="w-20 h-20 rounded-full bg-[#8BC9A5]/20 text-[#2F6B5B] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-[#2F6B5B] bg-[#8BC9A5]/20 px-3 py-1 rounded-full">
              پرداخت با موفقیت انجام شد
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-[#171A19] mt-3">
              سفارش شما در فروشگاه لوکس ثبت شد!
            </h2>
            <p className="text-xs md:text-sm text-[#6B756F] mt-1">
              کد رهگیری سفارش:{' '}
              <span className="font-mono font-bold text-[#171A19] bg-gray-100 px-2 py-0.5 rounded">
                {completedOrder.orderNumber}
              </span>
            </p>
          </div>

          <div className="bg-[#F7F7F2] p-5 rounded-2xl border border-[#E2E7E3] text-right space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-[#6B756F]">تحویل‌گیرنده:</span>
              <span className="font-bold text-[#171A19]">{completedOrder.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B756F]">شماره تماس:</span>
              <span className="font-bold text-[#171A19]">{completedOrder.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B756F]">آدرس تحویل:</span>
              <span className="font-bold text-[#171A19] max-w-xs text-left truncate">
                {completedOrder.address.street}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B756F]">روش ارسال:</span>
              <span className="font-bold text-[#2F6B5B]">{completedOrder.shippingMethod}</span>
            </div>
            <div className="flex justify-between border-t border-[#E2E7E3] pt-2">
              <span className="text-[#6B756F]">مبلغ پرداختی:</span>
              <span className="font-bold text-sm text-[#2F6B5B]">
                {formatPrice(completedOrder.totalAmount)} تومان
              </span>
            </div>
          </div>

          <p className="text-xs text-[#6B756F]">
            پیامک تایید سفارش و کد رهگیری پست برای شما ارسال شد.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {onNavigateTracking && (
              <button
                onClick={() => onNavigateTracking(completedOrder.orderNumber)}
                className="bg-[#171A19] hover:bg-[#2F6B5B] text-white px-5 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all shadow whitespace-nowrap"
              >
                پیگیری وضعیت این مرسوله
              </button>
            )}
            <button
              onClick={onContinueShopping}
              className="bg-[#2F6B5B] hover:bg-[#8BC9A5] text-white hover:text-[#171A19] px-6 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all shadow whitespace-nowrap"
            >
              بازگشت به صفحه اصلی فروشگاه
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
