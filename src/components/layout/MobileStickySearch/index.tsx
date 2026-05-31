'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

const DICT: Record<string, { placeholder: string; button: string }> = {
  az: { placeholder: 'Restoran və ya mətbəx axtar', button: 'Axtar' },
  en: { placeholder: 'Search restaurants or cuisines', button: 'Search' },
  ru: { placeholder: 'Поиск ресторанов или кухонь', button: 'Поиск' },
};

/**
 * Slim search bar for mobile that slides in from the top once the user
 * scrolls past the hero, and hides again near the top. Keeps search always
 * reachable without covering content. Used on the home and places pages.
 */
export default function MobileStickySearch() {
  const { lang } = useParams<{ lang: string }>();
  const router = useRouter();
  const t = DICT[lang] ?? DICT.az;
  const [q, setQ] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 240)
        setShow(false); // near the top — hero search is visible
      else if (y > last + 4)
        setShow(false); // scrolling down — hide
      else if (y < last - 4) setShow(true); // scrolling up — reveal
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submit = () => {
    const s = q.trim();
    router.push(
      `/${lang || 'en'}/places${s ? `?search=${encodeURIComponent(s)}` : ''}`,
    );
  };

  return (
    <div
      className={`md:hidden fixed left-0 right-0 top-0 z-[110] transform-gpu transition-transform duration-300 ${
        show ? 'translate-y-0' : '-translate-y-full'
      }`}>
      <div className="border-b border-gray-200 bg-white/95 px-3 py-2.5 shadow-sm backdrop-blur">
        <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 pl-3.5 pr-1.5 py-1 transition-colors focus-within:border-[#006653]">
          <Search className="h-4 w-4 shrink-0 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder={t.placeholder}
            className="flex-1 bg-transparent py-1.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none"
          />
          <button
            type="button"
            onClick={submit}
            className="shrink-0 rounded-full bg-[#9fe870] px-4 py-1.5 text-xs font-semibold text-[#14532d] transition-colors hover:bg-[#8fdc5c]">
            {t.button}
          </button>
        </div>
      </div>
    </div>
  );
}
