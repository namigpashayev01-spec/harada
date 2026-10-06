'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  CalendarCheck,
  Clock,
  Ban,
  UtensilsCrossed,
  Images,
  Star,
  Store,
  LogOut,
  Loader2,
  Menu as MenuIcon,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ownerService, { type OwnedRestaurant } from '@/services/owner.service';
import { managerDict } from './dict';

interface ManagerContextValue {
  restaurant: OwnedRestaurant;
  restaurants: OwnedRestaurant[];
  setRestaurantId: (id: number) => void;
  lang: string;
}

const ManagerContext = createContext<ManagerContextValue | null>(null);

/** Aktiv restoranı səhifələrə ötürür — hər səhifə eyni sorğunu təkrarlamasın. */
export function useManager() {
  const ctx = useContext(ManagerContext);
  if (!ctx) throw new Error('useManager ManagerShell içində işlədilməlidir');
  return ctx;
}

export default function ManagerShell({
  lang,
  children,
}: {
  lang: string;
  children: React.ReactNode;
}) {
  const t = managerDict(lang);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isInitializing, logout } = useAuth();

  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const [drawer, setDrawer] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['owner', 'restaurants'],
    queryFn: () => ownerService.getRestaurants(),
    enabled: isAuthenticated,
  });

  const restaurants = data?.data ?? [];

  useEffect(() => {
    if (restaurantId === null && restaurants.length > 0) {
      setRestaurantId(restaurants[0].id);
    }
  }, [restaurants, restaurantId]);

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.replace(`/${lang}/login`);
    }
  }, [isInitializing, isAuthenticated, lang, router]);

  useEffect(() => {
    setDrawer(false);
  }, [pathname]);

  if (isInitializing || isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <Store className="mx-auto h-9 w-9 text-gray-300" />
          <p className="mt-4 text-sm text-gray-600">{t.notOwner}</p>
          <button
            onClick={() => logout()}
            className="mt-5 text-sm font-medium text-[#006653] underline underline-offset-2">
            {t.logout}
          </button>
        </div>
      </div>
    );
  }

  const active = restaurants.find((r) => r.id === restaurantId) ?? restaurants[0];

  const nav = [
    { href: '', icon: LayoutDashboard, label: t.nav.overview },
    { href: '/reservations', icon: CalendarCheck, label: t.nav.reservations },
    { href: '/blocks', icon: Ban, label: t.nav.blocks },
    { href: '/hours', icon: Clock, label: t.nav.hours },
    { href: '/menu', icon: UtensilsCrossed, label: t.nav.menu },
    { href: '/photos', icon: Images, label: t.nav.photos },
    { href: '/reviews', icon: Star, label: t.nav.reviews },
    { href: '/settings', icon: Store, label: t.nav.settings },
  ];

  const base = `/${lang}`;
  const isActive = (href: string) => {
    const full = `${base}${href}`;
    return href === '' ? pathname === base || pathname === `${base}/` : pathname.startsWith(full);
  };

  return (
    <ManagerContext.Provider
      value={{ restaurant: active, restaurants, setRestaurantId, lang }}>
      <div className="min-h-screen bg-gray-50">
        {/* Üst zolaq */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3">
          <button
            onClick={() => setDrawer(true)}
            className="lg:hidden"
            aria-label="Menu">
            <MenuIcon className="h-5 w-5 text-gray-600" />
          </button>
          <span className="font-semibold text-[#006653]">{t.brand}</span>
          <span className="ml-auto truncate text-sm text-gray-500">
            {active.title}
          </span>
        </header>

        <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
          {/* Yan menyu */}
          <aside
            className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white p-4 transition-transform lg:static lg:z-auto lg:block lg:w-56 lg:translate-x-0 lg:bg-transparent lg:p-0 ${
              drawer ? 'translate-x-0 shadow-xl' : '-translate-x-full'
            }`}>
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <span className="font-semibold text-[#006653]">{t.brand}</span>
              <button onClick={() => setDrawer(false)} aria-label="Close">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {restaurants.length > 1 && (
              <select
                value={active.id}
                onChange={(e) => setRestaurantId(Number(e.target.value))}
                className="mb-4 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            )}

            <nav className="space-y-1">
              {nav.map((item) => {
                const Icon = item.icon;
                const act = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={`${base}${item.href}`}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                      act
                        ? 'bg-[#eefae1] font-semibold text-[#006653]'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={() => logout()}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4" />
                {t.logout}
              </button>
            </nav>
          </aside>

          {drawer && (
            <div
              className="fixed inset-0 z-30 bg-black/30 lg:hidden"
              onClick={() => setDrawer(false)}
            />
          )}

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </ManagerContext.Provider>
  );
}
