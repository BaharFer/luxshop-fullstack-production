import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Phone,
  AlertCircle,
  ArrowLeft,
  User,
  Mail,
  KeyRound,
} from 'lucide-react';
import { User as UserType } from '../types';
import { api } from '../services/api';

interface Props {
  onLoginSuccess: (user: UserType) => void;
  onNavigateHome: () => void;
  onShowToast: (
    type: 'success' | 'error' | 'info',
    msg: string
  ) => void;
}

export const AdminAuthView: React.FC<Props> = ({
  onLoginSuccess,
  onNavigateHome,
  onShowToast,
}) => {
  const [register, setRegister] = useState(false);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [adminSecretKey, setAdminSecretKey] =
    useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    null
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const res = register
        ? await api.registerAdmin(
            name,
            identifier,
            password,
            email,
            adminSecretKey
          )
        : await api.login(
            identifier,
            password,
            'admin'
          );

      onLoginSuccess(res.user);

      onShowToast(
        'success',
        register
          ? `حساب مدیر ${res.user.name} ساخته شد.`
          : `ورود مدیر ${res.user.name} موفق بود.`
      );
    } catch (e: any) {
      setError(
        e.message ||
          'اطلاعات واردشده معتبر نیست.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-[#F7F7F2]">
      <section className="w-full max-w-md bg-white rounded-3xl border border-[#E2E7E3] shadow-xl p-5 sm:p-8">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-[#171A19] text-[#8BC9A5] flex items-center justify-center mb-4">
            <Shield className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-black">
            Store Manager
          </h1>

          <p className="text-xs text-[#6B756F] mt-2">
            ورود یا ساخت حساب مدیر فروشگاه
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            type="button"
            onClick={() => {
              setRegister(false);
              setError(null);
              setAdminSecretKey('');
            }}
            className={`py-2.5 rounded-xl text-xs font-bold ${
              !register
                ? 'bg-[#171A19] text-white'
                : 'bg-[#F7F7F2] text-[#6B756F]'
            }`}
          >
            ورود مدیر
          </button>

          <button
            type="button"
            onClick={() => {
              setRegister(true);
              setError(null);
            }}
            className={`py-2.5 rounded-xl text-xs font-bold ${
              register
                ? 'bg-[#171A19] text-white'
                : 'bg-[#F7F7F2] text-[#6B756F]'
            }`}
          >
            ثبت‌نام مدیر
          </button>
        </div>

        {register && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-6">
            <b>ثبت‌نام اولیه مدیر:</b>{' '}
            فقط اولین حساب مدیر امکان ثبت‌نام دارد.
            پس از ایجاد اولین مدیر، ثبت‌نام مدیر
            به‌صورت خودکار مسدود می‌شود.
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex gap-2">
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
              ایمیل یا شماره تماس
            </span>

            <div className="relative">
              <Phone className="absolute right-3 top-3.5 w-4 h-4 text-[#6B756F]" />

              <input
                required
                value={identifier}
                onChange={(e) =>
                  setIdentifier(e.target.value)
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

          {register && (
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
            className="w-full py-3.5 rounded-xl bg-[#171A19] text-white font-black disabled:opacity-50"
          >
            {loading
              ? 'در حال پردازش...'
              : register
                ? 'ساخت حساب مدیر'
                : 'ورود امن به مدیریت'}
          </button>
        </form>

        <button
          type="button"
          onClick={onNavigateHome}
          className="w-full mt-3 py-3 rounded-xl bg-[#F7F7F2] text-[#2F6B5B] text-sm font-bold flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          بازگشت به فروشگاه
        </button>
      </section>
    </main>
  );
};