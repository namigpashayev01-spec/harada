import Image from 'next/image';
import Link from 'next/link';
import { LifeBuoy } from 'lucide-react';
import LogoImg from '@/assets/images/logo.png';
import type { RestaurantRegisterDict } from '@/components/RestaurantRegister/translations';

export default function RegisterHeader({
  lang,
  logo,
  t,
}: {
  lang: string;
  logo?: string;
  t: RestaurantRegisterDict;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href={`/${lang}`} className="flex items-center gap-3">
          <Image
            src={logo || LogoImg}
            alt="Logo"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
            priority
          />
          <span className="hidden text-sm font-medium text-gray-500 sm:block">
            {t.ownerArea}
          </span>
        </Link>

        <a
          href="#help"
          className="flex items-center gap-2 rounded-full bg-[#9fe870] px-4 py-2 text-sm font-semibold text-[#14532d] transition-colors hover:bg-[#8fdc5c]">
          <LifeBuoy className="h-4 w-4" />
          {t.support}
        </a>
      </div>
    </header>
  );
}
