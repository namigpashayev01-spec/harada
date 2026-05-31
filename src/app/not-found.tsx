'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UtensilsCrossed, Home } from 'lucide-react';

const DICT: Record<
  string,
  { badge: string; title: string; subtitle: string; button: string }
> = {
  az: {
    badge: 'Səhifə tapılmadı',
    title: 'Bu yemək menyuda yoxdur',
    subtitle:
      'Axtardığınız səhifə tapılmadı və ya daşınıb. Gəlin sizi əsas süfrəyə qaytaraq.',
    button: 'Ana səhifəyə qayıt',
  },
  en: {
    badge: 'Page not found',
    title: "This dish isn't on the menu",
    subtitle:
      'The page you are looking for was not found or has moved. Let us take you back to the main course.',
    button: 'Back to Home',
  },
  ru: {
    badge: 'Страница не найдена',
    title: 'Этого блюда нет в меню',
    subtitle:
      'Запрашиваемая страница не найдена или была перемещена. Давайте вернём вас на главную.',
    button: 'На главную',
  },
};

export default function NotFound() {
  const pathname = usePathname();
  const seg = pathname?.split('/')[1] ?? '';
  const lang = ['az', 'en', 'ru'].includes(seg) ? seg : 'az';
  const t = DICT[lang];

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#013a30] via-[#006653] to-[#0a7d54] p-4">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#9fe870]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#9fe870]/10 blur-3xl" />

      <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
        {/* Plate with utensils */}
        <div className="mb-8 flex h-36 w-36 items-center justify-center rounded-full bg-white/10 ring-8 ring-white/5 backdrop-blur-sm">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#9fe870] shadow-2xl">
            <UtensilsCrossed className="h-11 w-11 text-[#14532d]" />
          </div>
        </div>

        <h1 className="text-7xl font-black leading-none tracking-tight text-[#9fe870] sm:text-8xl">
          404
        </h1>

        <span className="mt-4 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/90">
          {t.badge}
        </span>

        <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
          {t.title}
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">
          {t.subtitle}
        </p>

        <Link
          href={`/${lang}`}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#9fe870] px-6 py-3 font-semibold text-[#14532d] shadow-lg transition-colors hover:bg-[#8fdc5c]">
          <Home className="h-5 w-5" />
          {t.button}
        </Link>
      </div>
    </div>
  );
}
