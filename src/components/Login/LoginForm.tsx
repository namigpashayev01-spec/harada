'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface Dict {
  title: string;
  subtitle: string;
  email: string;
  emailPh: string;
  password: string;
  passwordPh: string;
  remember: string;
  signin: string;
  signingin: string;
  noAccount: string;
  signup: string;
  requiredErr: string;
  invalidErr: string;
  showPassword: string;
  hidePassword: string;
}

const DICT: Record<string, Dict> = {
  az: {
    title: 'Daxil ol',
    subtitle: 'Hesabınıza daxil olun',
    email: 'E-poçt',
    emailPh: 'E-poçt ünvanınız',
    password: 'Şifrə',
    passwordPh: 'Şifrəniz',
    remember: 'Məni xatırla',
    signin: 'Daxil ol',
    signingin: 'Daxil olunur…',
    noAccount: 'Hesabınız yoxdur?',
    signup: 'Qeydiyyatdan keç',
    requiredErr: 'E-poçt və şifrə mütləqdir.',
    invalidErr: 'E-poçt və ya şifrə yanlışdır.',
    showPassword: 'Şifrəni göstər',
    hidePassword: 'Şifrəni gizlət',
  },
  en: {
    title: 'Sign in',
    subtitle: 'Sign in to your account',
    email: 'Email',
    emailPh: 'Your email address',
    password: 'Password',
    passwordPh: 'Your password',
    remember: 'Remember me',
    signin: 'Sign in',
    signingin: 'Signing in…',
    noAccount: "Don't have an account?",
    signup: 'Sign up',
    requiredErr: 'Email and password are required.',
    invalidErr: 'Invalid email or password.',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
  },
  ru: {
    title: 'Вход',
    subtitle: 'Войдите в свой аккаунт',
    email: 'Эл. почта',
    emailPh: 'Ваш адрес эл. почты',
    password: 'Пароль',
    passwordPh: 'Ваш пароль',
    remember: 'Запомнить меня',
    signin: 'Войти',
    signingin: 'Вход…',
    noAccount: 'Нет аккаунта?',
    signup: 'Зарегистрироваться',
    requiredErr: 'Эл. почта и пароль обязательны.',
    invalidErr: 'Неверная эл. почта или пароль.',
    showPassword: 'Показать пароль',
    hidePassword: 'Скрыть пароль',
  },
};

export default function LoginForm() {
  const router = useRouter();
  const { lang } = useParams<{ lang: string }>();
  const t = DICT[lang] ?? DICT.az;
  const { login } = useAuth();
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    if (!email.trim() || !password) {
      setError(t.requiredErr);
      return;
    }
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      router.push(`/${lang}/dashboard/settings`);
    } catch (err) {
      const msg =
        (axios.isAxiosError(err) &&
          (err.response?.data as { message?: string } | undefined)?.message) ||
        t.invalidErr;
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const baseInput =
    'w-full pl-11 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006653]/40 focus:border-[#006653] transition';
  const inputClass = `${baseInput} pr-4`;
  const pwInputClass = `${baseInput} pr-11`;
  const iconClass =
    'pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400';

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
      <p className="mt-1 mb-6 text-sm text-gray-500">{t.subtitle}</p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            {t.email}
          </label>
          <div className="relative">
            <Mail className={iconClass} />
            <input
              type="email"
              placeholder={t.emailPh}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            {t.password}
          </label>
          <div className="relative">
            <Lock className={iconClass} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={t.passwordPh}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className={pwInputClass}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? t.hidePassword : t.showPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#006653] transition-colors">
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 py-1">
          <button
            type="button"
            onClick={() => setRememberMe(!rememberMe)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              rememberMe ? 'bg-[#006653]' : 'bg-gray-300'
            }`}>
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                rememberMe ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-gray-700 text-sm font-medium">{t.remember}</span>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#9fe870] hover:bg-[#8fdc5c] disabled:opacity-60 disabled:cursor-not-allowed text-[#14532d] font-bold py-3 px-4 rounded-lg uppercase tracking-wide transition-colors mt-2">
          {submitting ? t.signingin : t.signin}
        </button>
      </form>

      <div className="text-center mt-6">
        <span className="text-gray-500 text-sm">{t.noAccount} </span>
        <Link
          href={`/${lang || 'en'}/register`}
          className="text-[#006653] font-bold text-sm hover:underline">
          {t.signup}
        </Link>
      </div>
    </div>
  );
}
