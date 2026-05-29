'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/TranlateContext';

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const { lang } = useLanguage(); 

  return (
    <Link
      href={`/${lang}${href === '/' ? '' : href}`} 
      className="text-gray-700 xl:text-base text-[14px] hover:text-gray-900 font-medium transition-colors">
      {children}
    </Link>
  );
}

export default NavLink;
