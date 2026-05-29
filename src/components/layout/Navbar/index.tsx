'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import NavLink from './NavLink';
import { navbarData } from '@/data/navbarData';
import LogoImg from '@/assets/images/logo.png';
import LanguageSwitcher from './LanguageSwitcher';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
  logo?: string;
}

const VALID_LANGS = ['en', 'az', 'ru'];

export default function Navbar({ logo }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const urlLang = VALID_LANGS.includes(pathname?.split('/')[1])
    ? pathname.split('/')[1]
    : 'en';
  const { user, isAuthenticated, isInitializing, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-100 transition-all duration-300 ease-in-out bg-white border-b border-gray-200',
        visible ? 'translate-y-0' : '-translate-y-full',
        isScrolled ? 'shadow-md' : '',
      )}>
      <div className="px-[10px] xl:px-[72px] lg:px-[42px] mx-auto py-[20px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[36px]">
            <Link href={`/${urlLang}`} className="flex-shrink-0">
              <div className="w-[72px]">
                <Image
                  alt="Logo"
                  className="w-full h-full object-cover"
                  src={logo || LogoImg}
                  width={72}
                  height={72}
                  priority
                />
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-4 xl:space-x-8">
              {navbarData.map((item) => (
                <NavLink key={item.link} href={item.link}>
                  {item.text}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center cursor-pointer">
              <div className="flex items-center space-x-1">
                <LanguageSwitcher />
              </div>
            </div>

            {!isInitializing &&
              (isAuthenticated ? (
                <>
                  <Link
                    href={`/${urlLang}/dashboard/favorites`}
                    className="hidden md:flex text-red-500 hover:text-red-600 transition-colors"
                    aria-label="Favorites">
                    <Heart size={24} />
                  </Link>
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen((v) => !v)}
                      className="hidden md:flex items-center gap-2 text-gray-700 hover:text-gray-900">
                      {user?.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#F57D0D]/10 text-[#F57D0D] flex items-center justify-center">
                          <User size={18} />
                        </div>
                      )}
                      <span className="text-sm font-medium max-w-[140px] truncate">
                        {user?.name ?? 'Account'}
                      </span>
                    </button>
                    {menuOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                        <Link
                          href={`/${urlLang}/dashboard/settings`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          Profile settings
                        </Link>
                        <Link
                          href={`/${urlLang}/dashboard/reservations`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          Reservations
                        </Link>
                        <Link
                          href={`/${urlLang}/dashboard/favorites`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          Favorites
                        </Link>
                        <Link
                          href={`/${urlLang}/dashboard/reviews`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          Reviews
                        </Link>
                        <div className="my-1 border-t border-gray-100" />
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            logout();
                          }}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                          <LogOut size={16} />
                          Log out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href={`/${urlLang}/register`}
                    className="hidden md:block text-gray-700 hover:text-gray-900 xl:text-base text-[14px] font-medium">
                    Sign up
                  </Link>
                  <Link
                    href={`/${urlLang}/login`}
                    className="hidden md:flex bg-[#F57D0D] xl:text-base text-[14px] items-center justify-center text-white px-6 py-2 rounded-md font-medium hover:bg-opacity-90 transition-colors">
                    Log in
                  </Link>
                </>
              ))}
          </div>
        </div>
      </div>
    </header>
  );
}
