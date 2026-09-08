import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Headphones, ShieldCheck, Truck } from 'lucide-react';
import { api } from '../services/api';

interface ContactViewProps {
  onShowToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onShowToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      onShowToast('error', 'لطفاً نام و متن پیام را وارد فرمایید.');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.sendContactMessage(formData);
      setIsSubmitted(true);
      onShowToast('success', 'پیام شما با موفقیت به پشتیبانی فروشگاه لوکس ارسال شد.');
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      onShowToast('error', err.message || 'خطا در ارسال پیام');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-10 space-y-12">
      {/* Header Banner */}
      <div className="text-right space-y-3">
        <h1 className="text-2xl md:text-3xl font-black text-[#171A19]">
          تماس با ما و مرکز پشتیبانی
        </h1>
        <p className="text-sm text-[#6B756F] max-w-2xl">
          تیم پشتیبانی فروشگاه لوکس در ۷ روز هفته آماده پاسخگویی به پرسش‌ها، پیگیری سفارشات و ارائه مشاوره تخصصی پیش از خرید است.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info Cards (Left / 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E2E7E3] shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-[#171A19] pb-3 border-b border-[#E2E7E3]">
              راه‌های ارتباطی مستقیم
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#2F6B5B]/10 text-[#2F6B5B] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#6B756F]">شماره تماس و پشتیبانی</div>
                  <a href="tel:02188889999" className="text-sm font-bold text-[#171A19] hover:text-[#2F6B5B] dir-ltr inline-block">
                    ۰۲۱-۸۸۸۸۹۹۹۹
                  </a>
                  <p className="text-[11px] text-gray-400 mt-0.5">پاسخگویی ۹ صبح الی ۲۱ شب</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#2F6B5B]/10 text-[#2F6B5B] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#6B756F]">پست الکترونیک</div>
                  <a href="mailto:support@luxshop.ir" className="text-sm font-bold text-[#171A19] hover:text-[#2F6B5B]">
                    support@luxshop.ir
                  </a>
                  <p className="text-[11px] text-gray-400 mt-0.5">پاسخگویی حداکثر ظرف ۴ ساعت کاری</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#2F6B5B]/10 text-[#2F6B5B] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#6B756F]">دفتر مرکزی و شوروم</div>
                  <p className="text-sm font-semibold text-[#171A19]">
                    تهران، خیابان ولیعصر، بالاتر از میدان ونک، برج نگین، طبقه ۵، واحد ۵۰۲
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#2F6B5B]/10 text-[#2F6B5B] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#6B756F]">ساعات کاری دفتر</div>
                  <p className="text-sm font-semibold text-[#171A19]">
                    شنبه تا چهارشنبه: ۹:۰۰ الی ۱۸:۰۰ | پنجشنبه: ۹:۰۰ الی ۱۳:۳۰
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Assurance Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#EAEFEA] rounded-xl p-3 text-center border border-[#D5DFD7]">
              <Headphones className="w-5 h-5 text-[#2F6B5B] mx-auto mb-1.5" />
              <div className="text-xs font-bold text-[#171A19]">مشاوره تخصصی</div>
              <div className="text-[10px] text-[#6B756F]">پیش از خرید</div>
            </div>
            <div className="bg-[#EAEFEA] rounded-xl p-3 text-center border border-[#D5DFD7]">
              <ShieldCheck className="w-5 h-5 text-[#2F6B5B] mx-auto mb-1.5" />
              <div className="text-xs font-bold text-[#171A19]">اصالت کالا</div>
              <div className="text-[10px] text-[#6B756F]">تضمین ۱۰۰٪</div>
            </div>
            <div className="bg-[#EAEFEA] rounded-xl p-3 text-center border border-[#D5DFD7]">
              <Truck className="w-5 h-5 text-[#2F6B5B] mx-auto mb-1.5" />
              <div className="text-xs font-bold text-[#171A19]">ارسال اکسپرس</div>
              <div className="text-[10px] text-[#6B756F]">سراسر ایران</div>
            </div>
          </div>
        </div>

        {/* Contact Form (Right / 7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#E2E7E3] shadow-sm">
            <h2 className="text-lg font-bold text-[#171A19] mb-2">
              فرم ارسال پیام به مدیریت و پشتیبانی
            </h2>
            <p className="text-xs text-[#6B756F] mb-6">
              پیام‌های شما مستقیماً توسط کارشناسان ارشد فروشگاه لوکس بررسی و پاسخ داده می‌شود.
            </p>

            {isSubmitted ? (
              <div className="bg-[#8BC9A5]/20 border border-[#8BC9A5] rounded-2xl p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#2F6B5B] mx-auto" />
                <h3 className="text-base font-bold text-[#171A19]">پیام شما با موفقیت ثبت شد</h3>
                <p className="text-xs text-[#6B756F]">
                  از تماس شما با فروشگاه لوکس سپاسگزاریم. پاسخ در سریع‌ترین زمان ممکن برای شما ارسال خواهد شد.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 px-6 py-2 bg-[#2F6B5B] text-white rounded-xl text-xs font-bold hover:bg-[#255648] transition-colors"
                >
                  ارسال پیام جدید
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-right">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#171A19] mb-1.5">
                      نام و نام خانوادگی <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="مثال: سهراب سپهری"
                      className="w-full bg-[#F7F7F2] border border-[#E2E7E3] rounded-xl px-4 py-2.5 text-xs text-[#171A19] focus:outline-none focus:border-[#2F6B5B] focus:ring-1 focus:ring-[#2F6B5B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171A19] mb-1.5">
                      شماره تماس همراه
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                      className="w-full bg-[#F7F7F2] border border-[#E2E7E3] rounded-xl px-4 py-2.5 text-xs text-[#171A19] focus:outline-none focus:border-[#2F6B5B] focus:ring-1 focus:ring-[#2F6B5B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#171A19] mb-1.5">
                      پست الکترونیک (ایمیل)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@domain.com"
                      className="w-full bg-[#F7F7F2] border border-[#E2E7E3] rounded-xl px-4 py-2.5 text-xs text-[#171A19] focus:outline-none focus:border-[#2F6B5B] focus:ring-1 focus:ring-[#2F6B5B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171A19] mb-1.5">
                      موضوع پیام
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="پیگیری سفارش، سوال فنی یا همکاری"
                      className="w-full bg-[#F7F7F2] border border-[#E2E7E3] rounded-xl px-4 py-2.5 text-xs text-[#171A19] focus:outline-none focus:border-[#2F6B5B] focus:ring-1 focus:ring-[#2F6B5B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#171A19] mb-1.5">
                    متن پیام <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="پرسش یا پیام خود را با جزییات بنویسید..."
                    className="w-full bg-[#F7F7F2] border border-[#E2E7E3] rounded-xl p-4 text-xs text-[#171A19] focus:outline-none focus:border-[#2F6B5B] focus:ring-1 focus:ring-[#2F6B5B] resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-3 bg-[#2F6B5B] hover:bg-[#255648] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'در حال ارسال پیام...' : 'ارسال پیام به فروشگاه لوکس'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
