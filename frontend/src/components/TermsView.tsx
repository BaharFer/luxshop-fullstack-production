import React from 'react';
import { ShieldCheck, Scale, FileText, CheckCircle, AlertCircle, RotateCcw, Lock } from 'lucide-react';

export const TermsView: React.FC = () => {
  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-right space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#8BC9A5]/20 text-[#2F6B5B] text-xs font-bold">
          <Scale className="w-3.5 h-3.5" />
          <span>قوانین و مقررات تجارت الکترونیک</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-[#171A19]">
          قوانین، ضوابط و حریم خصوصی در فروشگاه لوکس
        </h1>
        <p className="text-xs md:text-sm text-[#6B756F] max-w-2xl">
          استفاده از خدمات فروشگاه لوکس و ثبت سفارش به منزله پذیرش آگاهانه قوانین زیر مطابق با قانون تجارت الکترونیک جمهوری اسلامی ایران می‌باشد.
        </p>
      </div>

      {/* Terms Sections */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Quick Nav / Highlights */}
        <div className="md:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-[#E2E7E3] space-y-4 sticky top-24">
            <h3 className="text-sm font-bold text-[#171A19] pb-2 border-b border-[#E2E7E3]">
              فهرست بخش‌های قوانین
            </h3>
            <ul className="space-y-2.5 text-xs text-[#525E57]">
              <li className="flex items-center gap-2 text-[#2F6B5B] font-bold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>۱. تعاریف و شرایط عمومی</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-gray-300" />
                <span>۲. فرآیند ثبت و پردازش سفارش</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-gray-300" />
                <span>۳. تضمین اصالت و سلامت فیزیکی</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-gray-300" />
                <span>۴. رویه بازگرداندن کالا و وجه</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-gray-300" />
                <span>۵. سیاست حفظ حریم خصوصی</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Full Text Content */}
        <div className="md:col-span-8 space-y-6 text-right">
          {/* Section 1 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E7E3] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#2F6B5B] font-bold text-sm">
              <FileText className="w-4 h-4" />
              <h2>۱. تعاریف و شرایط عمومی عضویت</h2>
            </div>
            <p className="text-xs text-[#525E57] leading-relaxed">
              «فروشگاه لوکس» به عنوان ارائه‌دهنده تخصصی کالاهای دیجیتال و اکسسوری مدرن، کلیه تعاملات خود را بر پایه احترام به حقوق مصرف‌کننده، شفافیت قیمت‌ها و تضمین بالاترین استاندارد کیفی پایه‌گذاری نموده است. هر کاربر با ایجاد حساب یا ثبت خرید متعهد می‌گردد که اطلاعات شخصی و آدرس پستی را به صورت کامل و صحیح وارد نماید.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E7E3] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#2F6B5B] font-bold text-sm">
              <AlertCircle className="w-4 h-4" />
              <h2>۲. ثبت، پردازش و ارسال سفارشات</h2>
            </div>
            <p className="text-xs text-[#525E57] leading-relaxed">
              سفارش‌های ثبت شده در تمامی روزهای کاری پردازش و آماده ارسال می‌گردند. در صورت اتمام موجودی یک کالا به دلیل تقاضای همزمان، سیستم به صورت خودکار مانع از بیش‌فروشی شده و مبالغ در صورت بروز هرگونه تداخل ظرف چند ساعت به حساب خریدار واریز خواهد شد.
            </p>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E7E3] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#2F6B5B] font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <h2>۳. ضمانت اصالت ۱۰۰٪ و گارانتی کالاها</h2>
            </div>
            <p className="text-xs text-[#525E57] leading-relaxed">
              فروشگاه لوکس اصالت تمام برندها و محصولات ارائه‌شده اعم از هدفون‌ها، ساعت‌های هوشمند و عطرها را به صورت رسمی تضمین می‌کند. کلیه کالاها در پلمپ اصلی کارخانه و با شناسه سریال یکتا تحویل مشتریان گرامی می‌گردند.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E7E3] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#2F6B5B] font-bold text-sm">
              <RotateCcw className="w-4 h-4" />
              <h2>۴. ضوابط بازگشت کالا (مهلت تست ۷ روزه)</h2>
            </div>
            <p className="text-xs text-[#525E57] leading-relaxed">
              مشتریان می‌توانند تا ۷ روز پس از دریافت بسته، در صورت وجود نقص فنی کارخانه یا عدم تطابق کالا با مشخصات درج‌شده در سایت، نسبت به درخواست مرجوعی اقدام نمایند. بدیهی است پلمپ عطریات و اقلام مصرفی بهداشتی به دلیل الزامات قانونی پس از باز شدن قابل استرداد نخواهد بود مگر در موارد ایراد فیزیکی قبل از تحویل.
            </p>
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E7E3] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#2F6B5B] font-bold text-sm">
              <Lock className="w-4 h-4" />
              <h2>۵. امنیت اطلاعات و حریم خصوصی خریداران</h2>
            </div>
            <p className="text-xs text-[#525E57] leading-relaxed">
              فروشگاه لوکس حفظ محرمانگی شماره‌های تماس، نشانی‌ها و سوابق خرید مشتریان را وظیفه قانونی خود دانسته و این داده‌ها صرفاً جهت هماهنگی ارسال و خدمات پس از فروش مورد استفاده قرار خواهند گرفت و به هیچ شخص یا نهاد ثالثی واگذار نمی‌شود.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
