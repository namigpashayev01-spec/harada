'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Store,
  ClipboardList,
  Settings,
  Calendar,
  Heart,
  MessageSquare,
  LogOut,
  Loader2,
  X,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import ownerService from '@/services/owner.service';

interface SidebarProps {
  lang?: string;
  open?: boolean;
  onClose?: () => void;
}

interface Dict {
  restaurant: string;
  ownerReservations: string;
  settings: string;
  reservations: string;
  favorites: string;
  reviews: string;
  logout: string;
  loggingOut: string;
}

const DICT: Record<string, Dict> = {
  az: {
    restaurant: 'Restoranım',
    ownerReservations: 'Restoran rezervasiyaları',
    settings: 'Profil tənzimləmələri',
    reservations: 'Rezervasiyalar',
    favorites: 'Sevimlilər',
    reviews: 'Rəylər',
    logout: 'Çıxış',
    loggingOut: 'Çıxılır…',
  },
  en: {
    restaurant: 'My restaurant',
    ownerReservations: 'Restaurant bookings',
    settings: 'Profile settings',
    reservations: 'Reservations',
    favorites: 'Favorites',
    reviews: 'Reviews',
    logout: 'Logout',
    loggingOut: 'Logging out…',
  },
  ru: {
    restaurant: 'Мой ресторан',
    ownerReservations: 'Брони ресторана',
    settings: 'Настройки профиля',
    reservations: 'Бронирования',
    favorites: 'Избранное',
    reviews: 'Отзывы',
    logout: 'Выход',
    loggingOut: 'Выход…',
  },
};

const menuItems = [
  { id: 'restaurant' as const, icon: Store, href: '/dashboard/restaurant' },
  { id: 'settings' as const, icon: Settings, href: '/dashboard/settings' },
  { id: 'reservations' as const, icon: Calendar, href: '/dashboard/reservations' },
  { id: 'favorites' as const, icon: Heart, href: '/dashboard/favorites' },
  { id: 'reviews' as const, icon: MessageSquare, href: '/dashboard/reviews' },
];

export default function Sidebar({ lang = 'en', open = false, onClose }: SidebarProps) {
  const t = DICT[lang] ?? DICT.en;
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const { logout } = useAuth();

  // "Restoran rezervasiyaları" yalnız təsdiqlənmiş sahiblərə lazımdır —
  // adi ziyarətçinin menyusunu doldurmasın.
  const { data: owned } = useQuery({
    queryKey: ['owner', 'restaurants'],
    queryFn: () => ownerService.getRestaurants(),
    staleTime: 5 * 60 * 1000,
  });
  const isOwner = (owned?.data?.length ?? 0) > 0;

  const items = isOwner
    ? [
        menuItems[0],
        {
          id: 'ownerReservations' as const,
          icon: ClipboardList,
          href: '/dashboard/restaurant/reservations',
        },
        ...menuItems.slice(1),
      ]
    : menuItems;

  const isActive = (href: string) => pathname.includes(href);

  // Close drawer on route change (mobile)
  useEffect(() => {
    if (onClose) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* Backdrop on mobile */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-72 lg:w-64 lg:min-w-[260px] xl:min-w-[300px] bg-white border-r border-gray-200 flex flex-col transition-transform duration-300',
          'lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}>
        {/* Close button on mobile */}
        <div className="lg:hidden flex justify-end p-3">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Close menu">
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 pb-4 space-y-2 lg:mt-[30px] overflow-y-auto">
          <div className="flex-1 space-y-2">
            {items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.id}
                  href={`/${lang}${item.href}`}
                  className={cn(
                    'relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group',
                    active
                      ? 'bg-[#eefae1] text-[#006653] font-semibold'
                      : 'text-gray-700 hover:bg-gray-50',
                  )}>
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-[#006653]" />
                  )}
                  <Icon
                    className={cn(
                      'w-5 h-5',
                      active
                        ? 'text-[#006653]'
                        : 'text-gray-500 group-hover:text-gray-700',
                    )}
                  />
                  <span className="text-sm font-medium">{t[item.id]}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-3 justify-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors w-full disabled:opacity-60">
            {loggingOut ? (
              <Loader2 className="w-5 h-5 text-gray-700 animate-spin" />
            ) : (
              <LogOut className="w-5 h-5 text-gray-700" />
            )}
            <span className="text-sm font-medium">
              {loggingOut ? t.loggingOut : t.logout}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
