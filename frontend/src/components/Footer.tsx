import React from 'react';
import { Truck, ShieldCheck, Clock, Award, Phone, Mail, MapPin } from 'lucide-react';
import { ActivePage } from '../types';

interface FooterProps {
  onNavigate: (page: ActivePage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#2F6B5B] text-white mt-auto border-t border-[#8BC9A5]/20">
      {/* Top Value Badges Section */}
      <div className="border-b border-white/10 bg-[#255649]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#8BC9A5] flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">ارسال سریع و رایگان</h4>
              <p className="text-xs text-white/70 mt-0.5">برای سفارش‌های بالای ۲ میلیون</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#8BC9A5] flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">ضمانت اصالت ۱۰۰٪</h4>
              <p className="text-xs text-white/70 mt-0.5">تمامی کالاها اورجینال هستند</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#8BC9A5] flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">۷ روز مهلت بازگشت</h4>
              <p className="text-xs text-white/70 mt-0.5">تعویض و مرجوع بدون قید و شرط</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#8BC9A5] flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">گارانتی معتبر شرکتی</h4>
              <p className="text-xs text-white/70 mt-0.5">پشتیبانی و خدمات پس از فروش</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-right">
        {/* About Brand */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-[#8BC9A5]">فروشگاه لوکس</span>
            <span className="text-xs bg-[#8BC9A5]/20 text-[#8BC9A5] px-2.5 py-0.5 rounded-full font-bold">
              نسخه ۲.۰
            </span>
          </div>
          <p className="text-sm text-white/80 leading-relaxed max-w-md">
            تجربه‌ای متمایز از خرید آنلاین با تمرکز بر کیفیت ساخت، زیبایی مینیمال و خدمات پشتیبانی اختصاصی. ارائه‌دهنده جدیدترین ساعت‌های هوشمند، هدست‌های بی‌سیم، اکسسوری‌های خاص و ادکلن‌های دست‌ساز.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/70 pt-2">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#8BC9A5]" /> ۰۲۱-۸۸۸۸۹۹۹۹
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#8BC9A5]" /> support@luxshop.ir
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-sm text-[#8BC9A5] mb-4">دسترسی سریع</h4>
          <ul className="space-y-2.5 text-sm text-white/80">
            <li>
              <button
                onClick={() => onNavigate('home')}
                className="hover:text-[#8BC9A5] transition-colors"
              >
                صفحه اصلی
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('categories')}
                className="hover:text-[#8BC9A5] transition-colors"
              >
                دسته‌بندی‌ها
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('cart')}
                className="hover:text-[#8BC9A5] transition-colors"
              >
                سبد خرید و تسویه حساب
              </button>
            </li>
          </ul>
        </div>

        {/* Support & Legal */}
        <div>
          <h4 className="font-bold text-sm text-[#8BC9A5] mb-4">خدمات مشتریان و قوانین</h4>
          <ul className="space-y-2.5 text-sm text-white/80">
            <li>
              <button
                onClick={() => onNavigate('contact')}
                className="hover:text-[#8BC9A5] transition-colors"
              >
                تماس با ما
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('faq')}
                className="hover:text-[#8BC9A5] transition-colors"
              >
                پرسش‌های متداول
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('terms')}
                className="hover:text-[#8BC9A5] transition-colors"
              >
                قوانین و مقررات
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('tracking')}
                className="hover:text-[#8BC9A5] transition-colors"
              >
                پیگیری سفارش
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/60">
        <div className="max-w-[1280px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© ۱۴۰۲ فروشگاه لوکس. تمامی حقوق مادی و معنوی محفوظ است.</p>
          <p className="text-[11px] text-white/50">پرداخت امن شاپرک • نماد اعتماد الکترونیکی • گارانتی اصالت کالا</p>
        </div>
      </div>
    </footer>
  );
};
