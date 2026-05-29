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
import { useLanguage } from '@/context/TranlateContext';
import { useAuth } from '@/context/AuthContext';
import { languageOptions } from '@/data/languageOptions';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function MobileBottomNav() {
  const { lang, changeLang } = useLanguage();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/places', label: 'Places', icon: MapPin },
    { href: '/blog', label: 'Blog', icon: BookOpen },
    {
      href: isAuthenticated ? '/dashboard/settings' : '/login',
      label: isAuthenticated ? 'Account' : 'Login',
      icon: User,
    },
  ];

  const getHref = (href: string) => `/${lang}${href === '/' ? '' : href}`;

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
    pathname.startsWith(`/${lang}/about`) || pathname.startsWith(`/${lang}/contact`);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around h-[60px] px-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={label}
                href={getHref(href)}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1">
                <Icon
                  size={22}
                  className={cn(
                    'transition-colors',
                    active ? 'text-[#006653]' : 'text-gray-500',
                  )}
                />
                <span
                  className={cn(
                    'text-[10px] font-medium transition-colors',
                    active ? 'text-[#006653]' : 'text-gray-500',
                  )}>
                  {label}
                </span>
              </Link>
            );
          })}

          <button
            onClick={() => setMoreOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1"
            aria-label="More">
            <Menu
              size={22}
              className={cn(
                'transition-colors',
                moreActive ? 'text-[#006653]' : 'text-gray-500',
              )}
            />
            <span
              className={cn(
                'text-[10px] font-medium transition-colors',
                moreActive ? 'text-[#006653]' : 'text-gray-500',
              )}>
              More
            </span>
          </button>
        </div>
      </nav>

      {/* Bottom sheet — overlay + slide-up panel */}
      <div
        className={cn(
          'md:hidden fixed inset-0 z-[60] bg-black/40 transition-opacity duration-200',
          moreOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={() => setMoreOpen(false)}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="More options"
        className={cn(
          'md:hidden fixed left-0 right-0 bottom-0 z-[61] bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out',
          moreOpen ? 'translate-y-0' : 'translate-y-full',
        )}>
        {/* Grab handle */}
        <div className="pt-3 pb-2 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>

        <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">More</h3>
          <button
            onClick={() => setMoreOpen(false)}
            className="p-1.5 rounded-full hover:bg-gray-100"
            aria-label="Close">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Pages */}
        <div className="px-5 py-3">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Pages
          </p>
          <div className="space-y-1">
            <Link
              href={`/${lang}/about`}
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50">
              <Info className="h-5 w-5 text-[#006653]" />
              <span className="text-sm font-medium text-gray-800">About Us</span>
            </Link>
            <Link
              href={`/${lang}/contact`}
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50">
              <Phone className="h-5 w-5 text-[#006653]" />
              <span className="text-sm font-medium text-gray-800">Contact</span>
            </Link>
          </div>
        </div>

        {/* Language */}
        <div className="px-5 py-3 border-t border-gray-100 pb-[max(env(safe-area-inset-bottom),1rem)]">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" /> Language
          </p>
          <div className="grid grid-cols-3 gap-2">
            {languageOptions.map((option) => {
              const active = option.code === lang;
              return (
                <button
                  key={option.code}
                  onClick={() => {
                    changeLang(option.code);
                    setMoreOpen(false);
                  }}
                  className={cn(
                    'flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium border transition-colors',
                    active
                      ? 'border-[#006653] bg-[#006653]/5 text-[#006653]'
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
