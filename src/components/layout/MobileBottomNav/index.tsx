'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  MapPin,
  BookOpen,
  User,
  Menu,
  Info,
  Phone,
  Globe,
  X,
  Check,
} from 'lucide-react';
import { useLanguage, useT } from '@/context/TranlateContext';
import { useAuth } from '@/context/AuthContext';
import { languageOptions } from '@/data/languageOptions';
import { homeLang, langsForPath, stripLang } from '@/lib/locales';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function MobileBottomNav() {
  const { lang, changeLang } = useLanguage();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);
  const t = useT();

  const navItems = [
    { href: '/', label: t('nav.homeShort'), icon: Home },
    { href: '/places', label: t('nav.places'), icon: MapPin },
    { href: '/blog', label: t('nav.blog'), icon: BookOpen },
    {
      href: isAuthenticated ? '/dashboard/settings' : '/login',
      label: isAuthenticated ? t('nav.account') : t('nav.loginShort'),
      icon: User,
    },
  ];

  // Home / Places / Blog are Azerbaijani-section pages: from a Serbian page they
  // open in English (there is no /sr/places).
  const getHref = (href: string) => `/${homeLang(lang)}${href === '/' ? '' : href}`;

  const isActive = (href: string) => {
    const fullHref = getHref(href);
    if (href === '/') return pathname === fullHref || pathname === `/${lang}`;
    return pathname.startsWith(fullHref);
  };

  // Close the "More" sheet automatically on route change
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  // Lock body scroll while the sheet is open
  useEffect(() => {
    if (moreOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [moreOpen]);

  const moreActive =
    pathname.startsWith(`/${lang}/about`) ||
    pathname.startsWith(`/${lang}/contact`);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/95 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-stretch justify-around px-1.5 pt-1.5 pb-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={label}
                href={getHref(href)}
                className="flex flex-1 flex-col items-center justify-center gap-1 py-1">
                <span
                  className={cn(
                    'flex h-8 w-14 items-center justify-center rounded-full transition-all duration-200',
                    active ? 'bg-[#9fe870]' : 'bg-transparent',
                  )}>
                  <Icon
                    size={20}
                    className={cn(
                      'transition-colors',
                      active ? 'text-[#14532d]' : 'text-gray-500',
                    )}
                  />
                </span>
                <span
                  className={cn(
                    'text-[10px] leading-none transition-colors',
                    active
                      ? 'font-semibold text-[#006653]'
                      : 'font-medium text-gray-500',
                  )}>
                  {label}
                </span>
              </Link>
            );
          })}

          <button
            onClick={() => setMoreOpen(true)}
            className="flex flex-1 flex-col items-center justify-center gap-1 py-1"
            aria-label={t('nav.more')}>
            <span
              className={cn(
                'flex h-8 w-14 items-center justify-center rounded-full transition-all duration-200',
                moreActive ? 'bg-[#9fe870]' : 'bg-transparent',
              )}>
              <Menu
                size={20}
                className={cn(
                  'transition-colors',
                  moreActive ? 'text-[#14532d]' : 'text-gray-500',
                )}
              />
            </span>
            <span
              className={cn(
                'text-[10px] leading-none transition-colors',
                moreActive
                  ? 'font-semibold text-[#006653]'
                  : 'font-medium text-gray-500',
              )}>
              {t('nav.more')}
            </span>
          </button>
        </div>
      </nav>

      {/* Bottom sheet — overlay + slide-up panel */}
      <div
        className={cn(
          'md:hidden fixed inset-0 z-[60] bg-black/40 transition-opacity duration-200',
          moreOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none',
        )}
        onClick={() => setMoreOpen(false)}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.more')}
        className={cn(
          'md:hidden fixed left-0 right-0 bottom-0 z-[61] bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out',
          moreOpen ? 'translate-y-0' : 'translate-y-full',
        )}>
        {/* Grab handle */}
        <div className="pt-3 pb-2 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>

        <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">{t('nav.more')}</h3>
          <button
            onClick={() => setMoreOpen(false)}
            className="p-1.5 rounded-full hover:bg-gray-100"
            aria-label={t('common.close')}>
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Pages */}
        <div className="px-5 py-3">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            {t('nav.pages')}
          </p>
          <div className="space-y-1">
            <Link
              href={`/${lang}/about`}
              className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-[#eefae1]">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eefae1]">
                <Info className="h-5 w-5 text-[#006653]" />
              </span>
              <span className="text-sm font-medium text-gray-800">
                {t('nav.about')}
              </span>
            </Link>
            <Link
              href={`/${lang}/contact`}
              className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-[#eefae1]">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eefae1]">
                <Phone className="h-5 w-5 text-[#006653]" />
              </span>
              <span className="text-sm font-medium text-gray-800">
                {t('nav.contact')}
              </span>
            </Link>
          </div>
        </div>

        {/* Language */}
        <div className="px-5 py-3 border-t border-gray-100 pb-[max(env(safe-area-inset-bottom),1rem)]">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" /> {t('nav.language')}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {/* Only the languages this page exists in (see LanguageSwitcher). */}
            {langsForPath(stripLang(pathname || '/'))
              .map((code) => languageOptions.find((o) => o.code === code))
              .filter((o): o is (typeof languageOptions)[number] => Boolean(o))
              .map((option) => {
              const active = option.code === lang;
              return (
                <button
                  key={option.code}
                  onClick={() => {
                    changeLang(option.code);
                    setMoreOpen(false);
                  }}
                  className={cn(
                    'flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium border transition-colors',
                    active
                      ? 'border-[#006653] bg-[#006653] text-white'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50',
                  )}>
                  {active && <Check className="h-3.5 w-3.5" />}
                  {option.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
