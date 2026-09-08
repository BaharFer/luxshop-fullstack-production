import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search, Sparkles, MessageCircleQuestion } from 'lucide-react';
import { FAQItem } from '../types';

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'سفارش و ارسال',
    question: 'سفارش‌ها چگونه و در چه بازه زمانی ارسال می‌شوند؟',
    answer: 'تمامی سفارش‌های تهران از طریق پیک اکسپرس اختصاصی ظرف حداکثر ۲۴ ساعت کاری تحویل می‌گردند. برای سایر شهرهای سراسر کشور، بسته‌ها از طریق پست پیشتاز یا تیپاکس ارسال شده و معمولاً بین ۲ الی ۳ روز کاری به مقصد می‌رسند.',
  },
  {
    id: 'faq-2',
    category: 'سفارش و ارسال',
    question: 'آیا امکان پیگیری آنلاین لحظه‌ای وضعیت سفارش وجود دارد؟',
    answer: 'بله، بلافاصله پس از ثبت سفارش، یک کد پیگیری اختصاصی (مانند #ORD-8932) برای شما پیامک می‌شود. شما می‌توانید با مراجعه به صفحه «پیگیری سفارش» در هر لحظه روند پردازش و کد رهگیری پستی را مشاهده فرمایید.',
  },
  {
    id: 'faq-3',
    category: 'ضمانت و اصالت',
    question: 'آیا کالاهای فروشگاه لوکس دارای گارانتی اصالت هستند؟',
    answer: 'تمامی محصولات عرضه‌شده در فروشگاه لوکس ۱۰۰٪ اورجینال و دارای ضمانت اصالت فیزیکی و سلامت هستند. لوازم صوتی و دیجیتال علاوه بر مهلت تست ۷ روزه، دارای گارانتی ۱۸ تا ۲۴ ماهه شرکتی معتبر می‌باشند.',
  },
  {
    id: 'faq-4',
    category: 'ضمانت و اصالت',
    question: 'شرایط مرجوعی کالا و بازگشت وجه تا ۷ روز به چه صورت است؟',
    answer: 'در صورتی که کالای دریافتی دارای مغایرت با اطلاعات سایت باشد یا دچار نقص فنی گردد، می‌توانید ظرف ۷ روز با پشتیبانی تماس گرفته و کالا را در جعبه اصلی مرجوع فرمایید. وجه پرداختی ظرف ۲۴ ساعت کاری به حساب شما عودت داده می‌شود.',
  },
  {
    id: 'faq-5',
    category: 'پرداخت و امنیت',
    question: 'روش‌های پرداخت در فروشگاه لوکس کدامند؟',
    answer: 'شما می‌توانید از طریق کلیه کارت‌های عضو شبکه شتاب با درگاه‌های امن بانکی (سامان، ملت، پاسارگاد و شاپرک) خرید خود را نهایی کنید. همچنین برای سفارش‌های شهر تهران امکان پرداخت در محل با هماهنگی قبلی میسر است.',
  },
  {
    id: 'faq-6',
    category: 'حساب کاربری و خدمات',
    question: 'چگونه می‌توانم مشخصات کاربری یا رمز عبورم را تغییر دهم؟',
    answer: 'از منوی بالای سایت با کلیک روی نام کاربری وارد پنل حساب خود شوید و در بخش تنظیمات، نام، شماره همراه، ایمیل و کلمه عبور را بروزرسانی فرمایید.',
  },
];

interface FAQViewProps {
  onNavigateToContact: () => void;
}

export const FAQView: React.FC<FAQViewProps> = ({ onNavigateToContact }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-3']);

  const categories = ['all', 'سفارش و ارسال', 'ضمانت و اصالت', 'پرداخت و امنیت', 'حساب کاربری و خدمات'];

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchCat = activeCategory === 'all' || item.category === activeCategory;
    const matchQuery =
      searchQuery.trim() === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#8BC9A5]/20 text-[#2F6B5B] text-xs font-bold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>پاسخ به سوالات پرتکرار</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-[#171A19]">
          پرسش‌های متداول مشتریان فروشگاه لوکس
        </h1>
        <p className="text-xs md:text-sm text-[#6B756F]">
          پاسخ سوالات متداول درباره نحوه ثبت سفارش، رویه‌های ارسال، ضمانت اصالت و بازگشت کالا
        </p>

        {/* Search input inside FAQ */}
        <div className="relative max-w-md mx-auto mt-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در سوالات (مثال: گارانتی، ارسال، درگاه...)"
            className="w-full bg-white border border-[#E2E7E3] rounded-2xl py-3 pr-11 pl-4 text-xs text-[#171A19] focus:outline-none focus:border-[#2F6B5B] shadow-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === cat
                ? 'bg-[#2F6B5B] text-white shadow-sm'
                : 'bg-white text-[#6B756F] border border-[#E2E7E3] hover:border-[#2F6B5B] hover:text-[#171A19]'
            }`}
          >
            {cat === 'all' ? 'همه پرسش‌ها' : cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="max-w-3xl mx-auto space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-[#E2E7E3]">
            <p className="text-xs text-gray-500">موردی متناسب با جستجوی شما یافت نشد.</p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-[#E2E7E3] overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full px-5 py-4 flex items-center justify-between text-right gap-4 hover:bg-[#F7F7F2]/60 transition-colors"
                >
                  <span className="text-sm font-bold text-[#171A19] leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg bg-[#F7F7F2] flex items-center justify-center text-[#2F6B5B] transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180 bg-[#2F6B5B] text-white' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#525E57] leading-relaxed border-t border-[#E2E7E3]/60 bg-[#FBFBF8]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Didn't find answer? Contact banner */}
      <div className="max-w-3xl mx-auto bg-[#EAEFEA] rounded-2xl p-6 border border-[#D5DFD7] flex flex-col md:flex-row items-center justify-between gap-4 text-right">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2F6B5B] text-white flex items-center justify-center flex-shrink-0">
            <MessageCircleQuestion className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#171A19]">پرسش دیگری در ذهن دارید؟</h3>
            <p className="text-xs text-[#6B756F]">مشاوران فروشگاه لوکس همواره آماده پاسخگویی هستند.</p>
          </div>
        </div>

        <button
          onClick={onNavigateToContact}
          className="px-6 py-2.5 bg-[#2F6B5B] hover:bg-[#255648] text-white text-xs font-bold rounded-xl transition-all whitespace-nowrap"
        >
          ارسال پیام به پشتیبانی
        </button>
      </div>
    </div>
  );
};
