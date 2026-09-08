import React, { useState, useEffect } from 'react';
import { Search, Package, CheckCircle2, Clock, Truck, MapPin, AlertCircle, ShoppingBag, ShieldCheck, Phone } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatPrice, toPersianDigits } from '../data';
import { api } from '../services/api';

interface OrderTrackingViewProps {
  initialOrderNumber?: string;
  onNavigateHome: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  initialOrderNumber = '',
  onNavigateHome,
  onShowToast,
}) => {
  const [query, setQuery] = useState<string>(initialOrderNumber || 'ORD-8932');
  const [loading, setLoading] = useState<boolean>(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setError('لطفاً شماره سفارش یا شماره تماس را وارد فرمایید.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const foundOrder = await api.trackOrder(searchQuery);
      setOrder(foundOrder);
    } catch (err: any) {
      setOrder(null);
      setError(err.message || 'سفارشی با این مشخصات یافت نشد.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      handleSearch(initialOrderNumber);
    } else {
      // Auto-load sample order #ORD-8932
      handleSearch('ORD-8932');
    }
  }, []);

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      case 'cancelled':
        return -1;
      default:
        return 1;
    }
  };

  const currentStep = order ? getStatusStep(order.status) : 0;

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-10 space-y-10">
      {/* Header */}
      <div className="text-right space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#8BC9A5]/20 text-[#2F6B5B] text-xs font-bold">
          <Truck className="w-3.5 h-3.5" />
          <span>رهگیری و استعلام وضعیت مرسوله</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-[#171A19]">
          پیگیری آنلاین وضعیت سفارش در فروشگاه لوکس
        </h1>
        <p className="text-xs md:text-sm text-[#6B756F] max-w-2xl">
          شماره سفارش (مانند ORD-8932) یا شماره تماس ثبت شده هنگام خرید را وارد کنید تا وضعیت لحظه‌ای بسته و مراحل آماده‌سازی را مشاهده نمایید.
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E7E3] shadow-sm max-w-3xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="شماره سفارش (مثال: ORD-8932) یا شماره تماس همراه..."
              className="w-full bg-[#F7F7F2] border border-[#E2E7E3] rounded-xl py-3 pr-11 pl-4 text-xs font-bold text-[#171A19] focus:outline-none focus:border-[#2F6B5B] focus:ring-1 focus:ring-[#2F6B5B]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-[#2F6B5B] hover:bg-[#255648] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
          >
            {loading ? 'در حال جستجو...' : 'استعلام وضعیت'}
          </button>
        </form>

        {/* Preset quick test buttons */}
        <div className="mt-4 pt-4 border-t border-[#E2E7E3]/60 flex items-center flex-wrap gap-2 text-xs">
          <span className="text-[#6B756F]">نمونه‌های آماده برای تست سریع:</span>
          {['ORD-8932', 'ORD-8931', 'ORD-8930'].map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                setQuery(code);
                handleSearch(code);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#F7F7F2] hover:bg-[#8BC9A5]/20 text-[#2F6B5B] font-bold text-[11px] border border-[#E2E7E3] transition-colors"
            >
              #{code}
            </button>
          ))}
        </div>
      </div>

      {/* Error View */}
      {error && (
        <div className="max-w-3xl bg-red-50 border border-red-200 rounded-2xl p-6 text-right flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-red-800">یافت نشد</h4>
            <p className="text-xs text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Order Result Card */}
      {order && (
        <div className="max-w-3xl space-y-6">
          {/* Order Header Summary */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E7E3] shadow-sm text-right space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E7E3]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-[#171A19]">سفارش {order.orderNumber}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'processing'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.status === 'delivered'
                      ? 'تحویل داده شده'
                      : order.status === 'shipped'
                      ? 'ارسال شده با پست/پیک'
                      : order.status === 'processing'
                      ? 'در حال آماده‌سازی در انبار'
                      : 'لغو شده'}
                  </span>
                </div>
                <div className="text-xs text-[#6B756F] mt-1">
                  تحویل‌گیرنده: <span className="font-bold text-[#171A19]">{order.customerName}</span> ({order.customerPhone}) • تاریخ ثبت: {order.date}
                </div>
              </div>

              <div className="text-left">
                <div className="text-xs text-[#6B756F]">مبلغ کل پرداخت شده</div>
                <div className="text-base font-black text-[#2F6B5B]">
                  {formatPrice(order.totalAmount)} <span className="text-xs font-normal text-[#6B756F]">تومان</span>
                </div>
              </div>
            </div>

            {/* Visual Timeline Steps */}
            <div>
              <h3 className="text-xs font-bold text-[#6B756F] mb-4">مراحل فرآیند ارسال مرسوله:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                {/* Step 1 */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    currentStep >= 1
                      ? 'bg-[#8BC9A5]/10 border-[#8BC9A5] text-[#2F6B5B]'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-bold">۱. ثبت و تایید سفارش</span>
                  </div>
                  <p className="text-[11px] text-[#6B756F]">پرداخت موفق از طریق درگاه بانکی</p>
                </div>

                {/* Step 2 */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    currentStep >= 2
                      ? 'bg-[#8BC9A5]/10 border-[#8BC9A5] text-[#2F6B5B]'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Truck className="w-4 h-4" />
                    <span className="text-xs font-bold">۲. بسته‌بندی و تحویل به پست</span>
                  </div>
                  <p className="text-[11px] text-[#6B756F]">روش ارسال: {order.shippingMethod}</p>
                </div>

                {/* Step 3 */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    currentStep >= 3
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Package className="w-4 h-4" />
                    <span className="text-xs font-bold">۳. تحویل به خریدار</span>
                  </div>
                  <p className="text-[11px] text-[#6B756F]">تحویل به نشانی گیرنده</p>
                </div>
              </div>
            </div>

            {/* Shipping & Delivery Info */}
            <div className="bg-[#F7F7F2] rounded-xl p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#171A19]">
                <MapPin className="w-4 h-4 text-[#2F6B5B]" />
                <span>نشانی پستی تحویل:</span>
              </div>
              <p className="text-[#525E57] pr-6">
                {order.address.province}، {order.address.city}، {order.address.street} (کد پستی: {toPersianDigits(order.address.postalCode)})
              </p>
              {order.address.notes && (
                <p className="text-[#6B756F] text-[11px] pr-6">یادداشت خریدار: {order.address.notes}</p>
              )}
            </div>

            {/* Items List */}
            <div>
              <h3 className="text-xs font-bold text-[#171A19] mb-3">اقلام موجود در این مرسوله:</h3>
              <div className="space-y-2">
                {order.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E2E7E3]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#F7F7F2] rounded-lg p-1 flex items-center justify-center flex-shrink-0">
                        <img
                          src={it.product.image}
                          alt={it.product.title}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#171A19]">{it.product.title}</div>
                        <div className="text-[11px] text-[#6B756F]">
                          رنگ انتخابی: {it.selectedColor} • تعداد: {toPersianDigits(it.quantity)} عدد
                        </div>
                      </div>
                    </div>

                    <div className="text-xs font-bold text-[#2F6B5B]">
                      {formatPrice(it.product.price * it.quantity)} تومان
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
