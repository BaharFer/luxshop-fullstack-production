import React, { useEffect, useState } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Lock,
  Phone,
  Mail,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { api } from '../services/api';
import { User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: 'customer' | 'admin';
  onLoginSuccess: (user: UserType) => void;
  onShowToast: (
    type: 'success' | 'error' | 'info',
    message: string
  ) => void;
}

type Role = 'customer' | 'admin';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'customer',
  onLoginSuccess,
  onShowToast,
}) => {
  const [role, setRole] = useState<Role>(initialRole);
  const [register, setRegister] = useState(false);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [adminSecretKey, setAdminSecretKey] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setRole(initialRole);
      setRegister(true);
      setError(null);

      setPhone('');
      setPassword('');
      setName('');
      setEmail('');
      setAdminSecretKey('');
    }
  }, [isOpen, initialRole]);

  if (!isOpen) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const res =
        register
          ? role === 'admin'
            ? await api.registerAdmin(
                name,
                phone,
                password,
                email,
                adminSecretKey
              )
            : await api.register(
                name,
                phone,
                password,
                email
              )
          : await api.login(
              phone,
              password,
              role
            );

      onLoginSuccess(res.user);

      onShowToast(
        'success',
        register
          ? `حساب ${
              role === 'admin'
                ? 'مدیر فروشگاه'
                : 'مشتری'
            } با موفقیت ساخته شد.`
          : role === 'admin'
            ? `ورود مدیر ${res.user.name} با موفقیت انجام شد.`
            : `خوش آمدید ${res.user.name}!`
      );

      onClose();
    } catch (err: any) {
      setError(
        err.message || 'خطا در احراز هویت.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#171A19]/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onMouseDown={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[calc(100vh-24px)] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-[#E2E7E3] text-right"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          className={`sticky top-0 z-10 px-5 sm:px-6 py-5 text-white flex items-center justify-between ${
            role === 'admin'
              ? 'bg-[#171A19]'
              : 'bg-[#2F6B5B]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              {role === 'admin' ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>

            <div>
              <h3 className="font-black text-base sm:text-lg">
                احراز هویت فروشگاه لوکس
              </h3>

              <p className="text-[11px] text-white/70">
                حساب{' '}
                {role === 'admin'
                  ? 'مدیر فروشگاه'
                  : 'مشتری'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#F7F7F2] rounded-2xl border border-[#E2E7E3]">
            <button
              type="button"
              onClick={() => {
                setRole('customer');
                setRegister(true);
                setError(null);
                setAdminSecretKey('');
              }}
              className={`py-3 rounded-xl text-sm font-bold ${
                role === 'customer'
                  ? 'bg-white text-[#2F6B5B] shadow-sm'
                  : 'text-[#6B756F]'
              }`}
            >
              مشتری
            </button>

            <button
              type="button"
              onClick={() => {
                setRole('admin');
                setRegister(true);
                setError(null);
              }}
              className={`py-3 rounded-xl text-sm font-bold ${
                role === 'admin'
                  ? 'bg-[#171A19] text-white shadow-sm'
                  : 'text-[#6B756F]'
              }`}
            >
              مدیر فروشگاه
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setRegister(false);
                setError(null);
                setAdminSecretKey('');
              }}
              className={`py-2.5 rounded-xl text-xs font-bold ${
                !register
                  ? 'bg-[#2F6B5B] text-white'
                  : 'bg-[#F7F7F2] text-[#6B756F]'
              }`}
            >
              ورود
            </button>

            <button
              type="button"
              onClick={() => {
                setRegister(true);
                setError(null);
              }}
              className={`py-2.5 rounded-xl text-xs font-bold ${
                register
                  ? 'bg-[#2F6B5B] text-white'
                  : 'bg-[#F7F7F2] text-[#6B756F]'
              }`}
            >
              ثبت‌نام
            </button>
          </div>

          {role === 'admin' && register && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-6">
              <b>ثبت‌نام اولیه مدیر:</b>{' '}
              فقط اولین حساب مدیر امکان ثبت‌نام دارد.
              پس از ایجاد اولین مدیر، ثبت‌نام مدیر
              به‌صورت خودکار مسدود می‌شود.
            </div>
          )}

          {error && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form
            onSubmit={submit}
            className="space-y-4"
          >
            {register && (
              <label className="block">
                <span className="block text-xs font-bold mb-1.5">
                  نام و نام خانوادگی
                </span>

                <div className="relative">
                  <User className="absolute right-3 top-3.5 w-4 h-4 text-[#6B756F]" />

                  <input
                    required
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    autoComplete="name"
                    className="w-full rounded-xl border border-[#E2E7E3] py-3 pr-10 pl-3 text-sm outline-none focus:border-[#2F6B5B]"
                  />
                </div>
              </label>
            )}

            <label className="block">
              <span className="block text-xs font-bold mb-1.5">
                شماره تماس یا ایمیل
              </span>

              <div className="relative">
                <Phone className="absolute right-3 top-3.5 w-4 h-4 text-[#6B756F]" />

                <input
                  required
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  autoComplete="username"
                  className="w-full rounded-xl border border-[#E2E7E3] py-3 pr-10 pl-3 text-sm outline-none focus:border-[#2F6B5B]"
                />
              </div>
            </label>

            {register && (
              <label className="block">
                <span className="block text-xs font-bold mb-1.5">
                  ایمیل (اختیاری)
                </span>

                <div className="relative">
                  <Mail className="absolute right-3 top-3.5 w-4 h-4 text-[#6B756F]" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    autoComplete="email"
                    className="w-full rounded-xl border border-[#E2E7E3] py-3 pr-10 pl-3 text-sm outline-none focus:border-[#2F6B5B]"
                  />
                </div>
              </label>
            )}

            {role === 'admin' && register && (
              <label className="block">
                <span className="block text-xs font-bold mb-1.5">
                  کد راه‌اندازی مدیر
                </span>

                <div className="relative">
                  <KeyRound className="absolute right-3 top-3.5 w-4 h-4 text-[#6B756F]" />

                  <input
                    required
                    type="password"
                    value={adminSecretKey}
                    onChange={(e) =>
                      setAdminSecretKey(
                        e.target.value
                      )
                    }
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full rounded-xl border border-[#E2E7E3] py-3 pr-10 pl-3 text-sm outline-none focus:border-[#2F6B5B]"
                    placeholder="کد راه‌اندازی را وارد کنید"
                  />
                </div>

                <p className="mt-1.5 text-[10px] leading-5 text-[#8A938E]">
                  این کد فقط برای ایجاد اولین حساب مدیر
                  استفاده می‌شود.
                </p>
              </label>
            )}

            <label className="block">
              <span className="block text-xs font-bold mb-1.5">
                رمز عبور
              </span>

              <div className="relative">
                <Lock className="absolute right-3 top-3.5 w-4 h-4 text-[#6B756F]" />

                <input
                  required
                  minLength={8}
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete={
                    register
                      ? 'new-password'
                      : 'current-password'
                  }
                  className="w-full rounded-xl border border-[#E2E7E3] py-3 pr-10 pl-3 text-sm outline-none focus:border-[#2F6B5B]"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl text-sm font-black text-white disabled:opacity-50 ${
                role === 'admin'
                  ? 'bg-[#171A19]'
                  : 'bg-[#2F6B5B]'
              }`}
            >
              {loading
                ? 'در حال پردازش...'
                : register
                  ? `ایجاد حساب ${
                      role === 'admin'
                        ? 'مدیر'
                        : 'مشتری'
                    }`
                  : role === 'admin'
                    ? 'ورود به Store Management'
                    : 'ورود به حساب'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};