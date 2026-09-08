import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  Menu,
  X,
  LayoutDashboard,
  ShieldCheck,
  Truck,
  PhoneCall,
  HelpCircle,
  LogOut,
  Grid,
  Home,
  ChevronLeft,
} from 'lucide-react';
import { ActivePage, User } from '../types';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenSearch: () => void;
  currentUser: User | null;
  onOpenAuthModal?: (role?: 'customer' | 'admin') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  cartCount,
  wishlistCount,
  onOpenSearch,
  currentUser,
  onOpenAuthModal,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Close mobile drawer and user dropdown on page navigation or window resize
  const handleNavClick = (page: ActivePage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const handleOpenAuth = (role: 'customer' | 'admin' = 'customer') => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    if (typeof onOpenAuthModal === 'function') {
      onOpenAuthModal(role);
    }
  };

  // Close mobile menu when screen resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E7E3] w-full max-w-full transition-all">
      <div className="max-w-[1280px] mx-auto px-3 sm:px-4 md:px-8 lg:px-12 h-16 md:h-20 flex items-center justify-between gap-2">
        {/* Right side: Brand Logo & Desktop Nav */}
        <div className="flex items-center gap-4 lg:gap-6 shrink-0">
          <button
            onClick={() => handleNavClick('home')}
            className="text-lg sm:text-xl md:text-2xl font-black text-[#2F6B5B] hover:text-[#8BC9A5] transition-colors tracking-tight flex items-center gap-1.5 whitespace-nowrap group shrink-0"
            title="فروشگاه لوکس - بازگشت به صفحه اصلی"
          >
            <span>فروشگاه لوکس</span>
            <span className="w-2 h-2 rounded-full bg-[#8BC9A5] inline-block mb-1 group-hover:scale-125 transition-transform"></span>
          </button>

          {/* Desktop Navigation Links (xl+) */}
          <nav className="hidden xl:flex items-center gap-5 2xl:gap-6 text-[14px] font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`transition-colors py-1 whitespace-nowrap ${
                activePage === 'home'
                  ? 'text-[#2F6B5B] font-bold border-b-2 border-[#2F6B5B]'
                  : 'text-[#6B756F] hover:text-[#2F6B5B]'
              }`}
            >
              صفحه اصلی
            </button>
            <button
              onClick={() => handleNavClick('categories')}
              className={`transition-colors py-1 whitespace-nowrap ${
                activePage === 'categories'
                  ? 'text-[#2F6B5B] font-bold border-b-2 border-[#2F6B5B]'
                  : 'text-[#6B756F] hover:text-[#2F6B5B]'
              }`}
            >
              دسته‌بندی‌ها
            </button>
            <button
              onClick={() => handleNavClick('tracking')}
              className={`transition-colors py-1 flex items-center gap-1 whitespace-nowrap ${
                activePage === 'tracking'
                  ? 'text-[#2F6B5B] font-bold border-b-2 border-[#2F6B5B]'
                  : 'text-[#6B756F] hover:text-[#2F6B5B]'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>پیگیری سفارش</span>
            </button>
            <button
              onClick={() => handleNavClick('faq')}
              className={`transition-colors py-1 flex items-center gap-1 whitespace-nowrap ${
                activePage === 'faq'
                  ? 'text-[#2F6B5B] font-bold border-b-2 border-[#2F6B5B]'
                  : 'text-[#6B756F] hover:text-[#2F6B5B]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>سوالات متداول</span>
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`transition-colors py-1 flex items-center gap-1 whitespace-nowrap ${
                activePage === 'contact'
                  ? 'text-[#2F6B5B] font-bold border-b-2 border-[#2F6B5B]'
                  : 'text-[#6B756F] hover:text-[#2F6B5B]'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>تماس با ما</span>
            </button>
          </nav>
        </div>

        {/* Left side: Search & Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center justify-center gap-2 bg-[#F7F7F2] hover:bg-[#E2E7E3] text-[#6B756F] hover:text-[#171A19] w-9 h-9 sm:w-auto sm:h-auto sm:px-3 sm:py-2 rounded-full text-xs md:text-sm border border-[#E2E7E3] transition-all shrink-0 active:scale-95"
            title="جستجوی سریع محصولات"
          >
            <Search className="w-4 h-4 text-[#2F6B5B]" />
            <span className="hidden sm:inline">جستجو...</span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => handleNavClick('wishlist')}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center relative transition-colors shrink-0 active:scale-95 ${
              activePage === 'wishlist'
                ? 'bg-[#8BC9A5]/20 text-[#2F6B5B]'
                : 'text-[#6B756F] hover:bg-[#F7F7F2] hover:text-[#2F6B5B]'
            }`}
            title="لیست علاقه‌مندی‌ها"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#8BC9A5] text-[#171A19] text-[10px] font-bold min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={() => handleNavClick('cart')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs md:text-sm font-bold relative transition-all whitespace-nowrap shrink-0 active:scale-95 ${
              activePage === 'cart'
                ? 'bg-[#2F6B5B] text-white shadow-md'
                : 'bg-[#F7F7F2] text-[#2F6B5B] hover:bg-[#8BC9A5]/20 border border-[#E2E7E3]'
            }`}
            title="سبد خرید"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#8BC9A5] text-[#171A19] text-[9px] font-black min-w-[15px] h-[15px] px-0.5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">سبد خرید</span>
          </button>

          {/* User Account / Role Badge */}
          {currentUser ? (
            <div className="relative shrink-0">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:px-3 sm:py-1.5 bg-[#F7F7F2] hover:bg-[#EAEFEA] border border-[#E2E7E3] rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95"
                title={`حساب کاربری: ${currentUser.name}`}
              >
                <div className="w-6 h-6 rounded-full bg-[#2F6B5B] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  {currentUser.role === 'admin' ? 'مدیر' : currentUser.name.slice(0, 1)}
                </div>
                <span className="hidden md:inline max-w-[90px] truncate text-[11px] font-medium">
                  {currentUser.name}
                </span>
                {currentUser.role === 'admin' && (
                  <span className="hidden lg:inline-block px-1.5 py-0.5 rounded bg-[#8BC9A5]/40 text-[#2F6B5B] text-[10px]">
                    مدیر
                  </span>
                )}
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-52 bg-white rounded-2xl border border-[#E2E7E3] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 text-right"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-[#E2E7E3] mb-1">
                    <p className="text-xs font-bold text-[#171A19] truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-[#6B756F]">{currentUser.phone}</p>
                    <span className="inline-block mt-1 text-[10px] bg-[#8BC9A5]/30 text-[#2F6B5B] px-2 py-0.5 rounded font-semibold">
                      {currentUser.role === 'admin' ? 'مدیریت کل سیستم' : 'کاربر خریدار'}
                    </span>
                  </div>

{currentUser.role === 'admin' && (                  <button
                    onClick={() => handleNavClick('admin')}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold text-[#171A19] hover:bg-[#F7F7F2] flex items-center gap-2 text-right transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#2F6B5B] shrink-0" />
                    <span>{currentUser.role === 'admin' ? 'پنل مدیریت فروشگاه' : 'داشبورد کاربری'}</span>
                  </button>)}

                  <button
                    onClick={() => handleNavClick('tracking')}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold text-[#171A19] hover:bg-[#F7F7F2] flex items-center gap-2 text-right transition-colors"
                  >
                    <Truck className="w-4 h-4 text-[#2F6B5B] shrink-0" />
                    <span>پیگیری سفارشات من</span>
                  </button>

                  <button
                    onClick={onLogout}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 text-right mt-1 border-t border-[#E2E7E3] transition-colors"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>خروج از حساب</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Mobile Quick User Icon */}
              <button
                onClick={() => handleOpenAuth('customer')}
                className="md:hidden w-9 h-9 rounded-xl bg-[#F7F7F2] hover:bg-[#EAEFEA] border border-[#E2E7E3] text-[#2F6B5B] flex items-center justify-center active:scale-95"
                title="ورود / ثبت‌نام"
              >
                <UserIcon className="w-4 h-4" />
              </button>

              {/* Desktop User Login */}
              <button
                onClick={() => handleOpenAuth('customer')}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-2 bg-[#2F6B5B] hover:bg-[#255648] text-white rounded-xl text-xs font-bold transition-all shadow-xs whitespace-nowrap active:scale-95"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>ورود / عضویت</span>
              </button>


            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-[#171A19] hover:bg-[#F7F7F2] rounded-xl active:scale-95 transition-all shrink-0"
            aria-label="منوی موبایل"
            title="منوی دسترسی سریع"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#2F6B5B]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Backdrop overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 bg-black/40 backdrop-blur-xs z-30 xl:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 right-0 bg-white border-b border-[#E2E7E3] px-4 sm:px-6 py-4 space-y-4 shadow-2xl z-40 text-right max-h-[calc(100vh-4rem)] overflow-y-auto w-full animate-in slide-in-from-top-2 duration-200">
          {/* Quick Search inside Mobile Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="w-full flex items-center justify-between bg-[#F7F7F2] border border-[#E2E7E3] rounded-2xl py-2.5 px-4 text-xs text-[#6B756F] shadow-xs active:bg-[#EAEFEA]"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#2F6B5B]" />
                <span>جستجوی محصول، ساعت هوشمند، هدفون...</span>
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* User Status in Mobile Drawer */}
          {currentUser ? (
            <div className="p-3 bg-[#F7F7F2] rounded-2xl flex items-center justify-between border border-[#E2E7E3]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#2F6B5B] text-white flex items-center justify-center text-xs font-bold">
                  {currentUser.role === 'admin' ? 'مدیر' : currentUser.name.slice(0, 1)}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#171A19]">{currentUser.name}</div>
                  <div className="text-[10px] text-[#6B756F]">
                    {currentUser.role === 'admin' ? 'مدیر ارشد فروشگاه' : 'مشتری لوکس'} • {currentUser.phone}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-red-500 font-bold px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors"
              >
                خروج
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleOpenAuth('customer')}
                className="py-2.5 bg-[#2F6B5B] text-white rounded-xl text-xs font-bold text-center shadow-xs active:bg-[#255648] flex items-center justify-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>ورود / ثبت‌نام</span>
              </button>
              
            </div>
          )}

          {/* Navigation Links */}
          <div className="space-y-1 pt-1 border-t border-[#E2E7E3]">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                activePage === 'home'
                  ? 'bg-[#8BC9A5]/20 text-[#2F6B5B]'
                  : 'text-[#171A19] hover:bg-[#F7F7F2]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Home className="w-4 h-4 text-[#2F6B5B]" />
                <span>صفحه اصلی</span>
              </div>
              <ChevronLeft className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <button
              onClick={() => handleNavClick('categories')}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                activePage === 'categories'
                  ? 'bg-[#8BC9A5]/20 text-[#2F6B5B]'
                  : 'text-[#171A19] hover:bg-[#F7F7F2]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Grid className="w-4 h-4 text-[#2F6B5B]" />
                <span>دسته‌بندی‌های کالا</span>
              </div>
              <ChevronLeft className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <button
              onClick={() => handleNavClick('cart')}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                activePage === 'cart'
                  ? 'bg-[#8BC9A5]/20 text-[#2F6B5B]'
                  : 'text-[#171A19] hover:bg-[#F7F7F2]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-[#2F6B5B]" />
                <span>سبد خرید</span>
              </div>
              {cartCount > 0 && (
                <span className="bg-[#2F6B5B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {cartCount} عدد
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('wishlist')}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                activePage === 'wishlist'
                  ? 'bg-[#8BC9A5]/20 text-[#2F6B5B]'
                  : 'text-[#171A19] hover:bg-[#F7F7F2]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-[#2F6B5B]" />
                <span>علاقه‌مندی‌ها</span>
              </div>
              {wishlistCount > 0 && (
                <span className="bg-[#8BC9A5] text-[#171A19] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {wishlistCount} مورد
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('tracking')}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                activePage === 'tracking'
                  ? 'bg-[#8BC9A5]/20 text-[#2F6B5B]'
                  : 'text-[#171A19] hover:bg-[#F7F7F2]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#2F6B5B]" />
                <span>پیگیری آنلاین مرسوله</span>
              </div>
              <ChevronLeft className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <button
              onClick={() => handleNavClick('faq')}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                activePage === 'faq'
                  ? 'bg-[#8BC9A5]/20 text-[#2F6B5B]'
                  : 'text-[#171A19] hover:bg-[#F7F7F2]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-[#2F6B5B]" />
                <span>پرسش‌های متداول</span>
              </div>
              <ChevronLeft className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                activePage === 'contact'
                  ? 'bg-[#8BC9A5]/20 text-[#2F6B5B]'
                  : 'text-[#171A19] hover:bg-[#F7F7F2]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-[#2F6B5B]" />
                <span>تماس با پشتیبانی</span>
              </div>
              <ChevronLeft className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>


        </div>
      )}
    </header>
  );
};
