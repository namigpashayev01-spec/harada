'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface Dict {
  title: string;
  subtitle: string;
  name: string;
  namePh: string;
  email: string;
  emailPh: string;
  password: string;
  passwordPh: string;
  remember: string;
  signup: string;
  signingup: string;
  haveAccount: string;
  signin: string;
  requiredErr: string;
  genericErr: string;
}

const DICT: Record<string, Dict> = {
  az: {
    title: 'Qeydiyyat',
    subtitle: 'Hesab yaradın və masanızı rezerv edin',
    name: 'Ad',
    namePh: 'Tam adınız',
    email: 'E-poçt',
    emailPh: 'E-poçt ünvanınız',
    password: 'Şifrə',
    passwordPh: 'Şifrəniz',
    remember: 'Məni xatırla',
    signup: 'Qeydiyyatdan keç',
    signingup: 'Qeydiyyat…',
    haveAccount: 'Artıq hesabınız var?',
    signin: 'Daxil ol',
    requiredErr: 'Ad, e-poçt və şifrə mütləqdir.',
    genericErr: 'Hesab yaradıla bilmədi. Yenidən cəhd edin.',
  },
  en: {
    title: 'Register',
    subtitle: 'Create an account and book your table',
    name: 'Name',
    namePh: 'Your full name',
    email: 'Email',
    emailPh: 'Your email address',
    password: 'Password',
    passwordPh: 'Your password',
    remember: 'Remember me',
    signup: 'Sign up',
    signingup: 'Signing up…',
    haveAccount: 'Already have an account?',
    signin: 'Sign in',
    requiredErr: 'Name, email and password are required.',
    genericErr: 'Could not create your account. Please try again.',
  },
  ru: {
    title: 'Регистрация',
    subtitle: 'Создайте аккаунт и забронируйте столик',
    name: 'Имя',
    namePh: 'Ваше полное имя',
    email: 'Эл. почта',
    emailPh: 'Ваш адрес эл. почты',
    password: 'Пароль',
    passwordPh: 'Ваш пароль',
    remember: 'Запомнить меня',
    signup: 'Зарегистрироваться',
    signingup: 'Регистрация…',
    haveAccount: 'Уже есть аккаунт?',
    signin: 'Войти',
    requiredErr: 'Имя, эл. почта и пароль обязательны.',
    genericErr: 'Не удалось создать аккаунт. Попробуйте снова.',
  },
};

export default function RegisterForm() {
  const router = useRouter();
  const { lang } = useParams<{ lang: string }>();
  const t = DICT[lang] ?? DICT.az;
  const { register, login } = useAuth();
  const [rememberMe, setRememberMe] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    if (!name.trim() || !email.trim() || !password) {
      setError(t.requiredErr);
      return;
    }
    setSubmitting(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      // If register did not return a token, log in to finish the session.
      try {
        await login({ email: email.trim(), password });
      } catch {
        // ignore — user may already be logged in via register response
      }
      router.push(`/${lang || 'en'}/dashboard/settings`);
    } catch (err) {
      const msg =
        (axios.isAxiosError(err) &&
          ((err.response?.data as { message?: string } | undefined)?.message ||
            Object.values(
              (
                err.response?.data as
                  | { errors?: Record<string, string[]> }
                  | undefined
              )?.errors ?? {},
            )[0]?.[0])) ||
        t.genericErr;
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006653]/40 focus:border-[#006653] transition';

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
      <p className="mt-1 mb-6 text-sm text-gray-500">{t.subtitle}</p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            {t.name}
          </label>
          <input
            type="text"
            placeholder={t.namePh}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            {t.email}
          </label>
          <input
            type="email"
            placeholder={t.emailPh}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            {t.password}
          </label>
          <input
            type="password"
            placeholder={t.passwordPh}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className={inputClass}
          />
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
          {submitting ? t.signingup : t.signup}
        </button>
      </form>

      <div className="text-center mt-6">
        <span className="text-gray-500 text-sm">{t.haveAccount} </span>
        <Link
          href={`/${lang || 'en'}/login`}
          className="text-[#006653] font-bold text-sm hover:underline">
          {t.signin}
        </Link>
      </div>
    </div>
  );
}
