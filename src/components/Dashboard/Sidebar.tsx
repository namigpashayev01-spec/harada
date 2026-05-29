'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Settings,
  Calendar,
  Heart,
  MessageSquare,
  LogOut,
  Loader2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  lang?: string;
  open?: boolean;
  onClose?: () => void;
}

const menuItems = [
  { id: 'settings', label: 'Profile settings', icon: Settings, href: '/dashboard/settings' },
  { id: 'reservations', label: 'Reservations', icon: Calendar, href: '/dashboard/reservations' },
  { id: 'favorites', label: 'Favorites', icon: Heart, href: '/dashboard/favorites' },
  { id: 'reviews', label: 'Reviews', icon: MessageSquare, href: '/dashboard/reviews' },
];

export default function Sidebar({ lang = 'en', open = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const { logout } = useAuth();

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
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.id}
                  href={`/${lang}${item.href}`}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group',
                    active ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-100',
                  )}>
                  <Icon
                    className={cn(
                      'w-5 h-5',
                      active ? 'text-white' : 'text-gray-700 group-hover:text-gray-900',
                    )}
                  />
                  <span className="text-sm font-medium">{item.label}</span>
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
              {loggingOut ? 'Logging out…' : 'Logout'}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
