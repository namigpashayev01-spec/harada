'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  X,
  UtensilsCrossed,
  Calendar,
  Search,
  SearchX,
} from 'lucide-react';
import { Restaurant } from '@/types/restaurant';
import ReservationForm from '@/components/Places/ReservationForm';

interface RestaurantMenuProps {
  restaurant: Restaurant;
  lang: string;
}

interface Dict {
  reserveTable: string;
  emptyTitle: string;
  emptyDesc: string;
  backToRestaurant: string;
  all: string;
  searchPlaceholder: string;
  noResultsTitle: string;
  noResultsDesc: string;
  clearFilters: string;
  close: string;
  dishCount: (n: number) => string;
}

const DICT: Record<string, Dict> = {
  az: {
    reserveTable: 'Masa rezerv et',
    emptyTitle: 'Menyu hələ əlavə olunmayıb',
    emptyDesc:
      'Bu restoranın menyusu tezliklə əlavə olunacaq. Rezervasiya üçün restoran səhifəsinə keçin.',
    backToRestaurant: 'Restoran səhifəsinə qayıt',
    all: 'Hamısı',
    searchPlaceholder: 'Yemək axtar…',
    noResultsTitle: 'Nəticə tapılmadı',
    noResultsDesc: 'Başqa söz yazın və ya digər kateqoriyaya baxın.',
    clearFilters: 'Filtri sıfırla',
    close: 'Bağla',
    dishCount: (n) => `${n} yemək`,
  },
  en: {
    reserveTable: 'Reserve a Table',
    emptyTitle: 'Menu not available yet',
    emptyDesc:
      "This restaurant's menu will be added soon. Visit the restaurant page to make a reservation.",
    backToRestaurant: 'Back to restaurant page',
    all: 'All',
    searchPlaceholder: 'Search dishes…',
    noResultsTitle: 'Nothing found',
    noResultsDesc: 'Try a different word or browse another category.',
    clearFilters: 'Clear filters',
    close: 'Close',
    dishCount: (n) => `${n} ${n === 1 ? 'dish' : 'dishes'}`,
  },
  ru: {
    reserveTable: 'Забронировать столик',
    emptyTitle: 'Меню пока не добавлено',
    emptyDesc:
      'Меню этого ресторана скоро появится. Перейдите на страницу ресторана для брони.',
    backToRestaurant: 'Вернуться на страницу ресторана',
    all: 'Все',
    searchPlaceholder: 'Поиск блюда…',
    noResultsTitle: 'Ничего не найдено',
    noResultsDesc: 'Попробуйте другое слово или другую категорию.',
    clearFilters: 'Сбросить фильтр',
    close: 'Закрыть',
    dishCount: (n) => `${n} блюд`,
  },
};

/**
 * Fold Azerbaijani letters to ASCII so that typing "sorba" still finds
 * "Şorbalar" — visitors rarely switch keyboard layouts to search a menu.
 */
const FOLD: Record<string, string> = {
  ə: 'e', ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', İ: 'i',
};
const foldText = (s: string) =>
  (s || '')
    .toLowerCase()
    .split('')
    .map((c) => FOLD[c] ?? c)
    .join('');

export default function RestaurantMenu({
  restaurant,
  lang,
}: RestaurantMenuProps) {
  const t = DICT[lang] ?? DICT.en;
  const detailHref = `/${lang}/places/${
    restaurant.slug[lang as keyof typeof restaurant.slug] ||
    restaurant.slug.az ||
    restaurant.slug.en ||
    restaurant.slug.ru ||
    restaurant.id
  }`;

  const allMenuImages = restaurant.menus.flatMap((m) => m.images ?? []);
  // Memoised so the filtering below is not recomputed on every render
  // (the ?? [] fallback would otherwise be a new array each time).
  const structured = useMemo(
    () => restaurant.menu_categories ?? [],
    [restaurant.menu_categories],
  );
  const hasStructured = structured.length > 0;
  const hasImages = allMenuImages.length > 0;
  const hasMenu = hasStructured || hasImages;

  const [lightbox, setLightbox] = useState<number | null>(null);
  const [activeCat, setActiveCat] = useState<number | 'all'>('all');
  const [query, setQuery] = useState('');
  const [reserveOpen, setReserveOpen] = useState(false);
  const chipBarRef = useRef<HTMLDivElement>(null);

  // Category filter + free-text search, applied together: picking "Salatlar"
  // and typing "toyuq" narrows to chicken salads rather than resetting.
  const visible = useMemo(() => {
    const q = foldText(query.trim());
    return structured
      .filter((c) => activeCat === 'all' || c.id === activeCat)
      .map((c) =>
        q
          ? {
              ...c,
              dishes: c.dishes.filter(
                (d) =>
                  foldText(d.name).includes(q) ||
                  foldText(d.description || '').includes(q),
              ),
            }
          : c,
      )
      .filter((c) => c.dishes.length > 0);
  }, [structured, activeCat, query]);

  const visibleCount = visible.reduce((n, c) => n + c.dishes.length, 0);
  const isFiltered = activeCat !== 'all' || query.trim() !== '';

  // Keep the selected chip on screen — with ~30 categories the active one is
  // usually scrolled out of the strip after a tap.
  useEffect(() => {
    const el = chipBarRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeCat]);

  // Keyboard navigation for the menu image lightbox (← → to scroll, Esc to close)
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setLightbox((p) =>
          p === null ? p : (p - 1 + allMenuImages.length) % allMenuImages.length,
        );
      } else if (e.key === 'ArrowRight') {
        setLightbox((p) =>
          p === null ? p : (p + 1) % allMenuImages.length,
        );
      } else if (e.key === 'Escape') {
        setLightbox(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, allMenuImages.length]);

  // ---- Empty state ---------------------------------------------------------
  if (!hasMenu) {
    return (
      <div className="bg-white rounded-2xl p-10 shadow-sm flex flex-col items-center text-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eefae1]">
          <UtensilsCrossed className="h-8 w-8 text-[#006653]" />
        </span>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t.emptyTitle}</h2>
          <p className="text-gray-500 text-sm mt-1.5 max-w-md">{t.emptyDesc}</p>
        </div>
        <Link
          href={detailHref}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#9fe870] hover:bg-[#8fdc5c] text-[#14532d] font-semibold rounded-xl transition-colors">
          <Calendar className="h-5 w-5" />
          {t.reserveTable}
        </Link>
      </div>
    );
  }

  // ---- Menu ---------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Category filter + dish search */}
      {hasStructured && (
        <div className="sticky top-0 z-30 -mx-4 px-4 pt-3 pb-3 bg-gray-50/95 backdrop-blur supports-[backdrop-filter]:bg-gray-50/80">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-800 shadow-sm outline-none transition-colors placeholder:text-gray-400 focus:border-[#006653] focus:ring-2 focus:ring-[#9fe870]/50"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label={t.clearFilters}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div
            ref={chipBarRef}
            role="tablist"
            aria-label={t.searchPlaceholder}
            className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              role="tab"
              data-active={activeCat === 'all'}
              aria-selected={activeCat === 'all'}
              onClick={() => setActiveCat('all')}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCat === 'all'
                  ? 'bg-[#006653] text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#9fe870] hover:bg-[#eefae1]'
              }`}>
              {t.all}
            </button>
            {structured.map((category) => (
              <button
                key={category.id}
                role="tab"
                data-active={activeCat === category.id}
                aria-selected={activeCat === category.id}
                onClick={() =>
                  setActiveCat((prev) =>
                    prev === category.id ? 'all' : category.id,
                  )
                }
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCat === category.id
                    ? 'bg-[#006653] text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-[#9fe870] hover:bg-[#eefae1]'
                }`}>
                {category.name}
                <span
                  className={`ml-1.5 text-xs ${
                    activeCat === category.id ? 'text-[#9fe870]' : 'text-gray-400'
                  }`}>
                  {category.dishes.length}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Structured menu (categories -> dishes + price) */}
      {hasStructured && visible.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          {isFiltered && (
            <p className="mb-4 text-sm text-gray-500">{t.dishCount(visibleCount)}</p>
          )}
          <div className="space-y-7">
            {visible.map((category) => (
              <div key={category.id}>
                <h3 className="text-base font-semibold text-[#006653] mb-2.5 pb-2 border-b border-[#eefae1]">
                  {category.name}
                </h3>
                <ul className="divide-y divide-gray-100">
                  {category.dishes.map((dish) => (
                    <li
                      key={dish.id}
                      className="flex items-start justify-between gap-4 py-2.5">
                      <div className="min-w-0">
                        <span className="text-sm text-gray-800">
                          {dish.name}
                        </span>
                        {dish.description && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {dish.description}
                          </p>
                        )}
                      </div>
                      {dish.price !== null && (
                        <span className="shrink-0 text-sm font-semibold text-gray-900 whitespace-nowrap">
                          {dish.price} ₼
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No dish matches the current filter */}
      {hasStructured && visible.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-10 text-center shadow-sm">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eefae1]">
            <SearchX className="h-7 w-7 text-[#006653]" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{t.noResultsTitle}</h3>
            <p className="mt-1 text-sm text-gray-500">{t.noResultsDesc}</p>
          </div>
          <button
            onClick={() => {
              setQuery('');
              setActiveCat('all');
            }}
            className="rounded-xl bg-[#9fe870] px-5 py-2.5 text-sm font-semibold text-[#14532d] transition-colors hover:bg-[#8fdc5c]">
            {t.clearFilters}
          </button>
        </div>
      )}

      {/* Menu images */}
      {hasImages && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {allMenuImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setLightbox(idx)}
                className="rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 cursor-pointer hover:shadow-md transition-shadow">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={img}
                    alt={`${restaurant.title} menyu ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reserve CTA — fixed on every screen size, so booking stays one click
          away however far down a 300-dish menu the visitor has scrolled. On
          mobile it sits above the bottom nav (60px tall, z-50) and respects the
          iPhone home-indicator inset. */}
      <div className="h-24" aria-hidden="true" />
      <div className="fixed left-0 right-0 bottom-[calc(60px+env(safe-area-inset-bottom))] md:bottom-0 z-40 border-t border-gray-100 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <p className="hidden min-w-0 flex-1 truncate font-semibold text-gray-900 md:block">
            {restaurant.title}
          </p>
          <button
            onClick={() => setReserveOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#9fe870] py-3.5 font-semibold text-[#14532d] shadow-sm transition-colors hover:bg-[#8fdc5c] active:bg-[#8fdc5c] md:w-auto md:px-8">
            <Calendar className="h-5 w-5" />
            {t.reserveTable}
          </button>
        </div>
      </div>

      {/* Reservation dialog — same four-step form as the restaurant page */}
      {reserveOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 md:items-center"
          onClick={() => setReserveOpen(false)}>
          <div
            className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white shadow-2xl md:rounded-2xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#006653]" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {t.reserveTable}
                </h3>
              </div>
              <button
                onClick={() => setReserveOpen(false)}
                aria-label={t.close}
                className="rounded-full p-1.5 transition-colors hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <ReservationForm restaurant={restaurant} lang={lang} />
          </div>
        </div>
      )}

      {/* Image lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <div
            className="relative max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="absolute -top-10 right-0 text-white hover:text-gray-300">
              <X className="h-7 w-7" />
            </button>
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden">
              <Image
                src={allMenuImages[lightbox]}
                alt=""
                fill
                className="object-contain"
              />
              {allMenuImages.length > 1 && (
                <>
                  <button
                    aria-label="Previous image"
                    onClick={() =>
                      setLightbox(
                        (p) =>
                          p === null
                            ? p
                            : (p - 1 + allMenuImages.length) %
                              allMenuImages.length,
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2.5 transition-colors">
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    aria-label="Next image"
                    onClick={() =>
                      setLightbox((p) =>
                        p === null ? p : (p + 1) % allMenuImages.length,
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2.5 transition-colors">
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                    {lightbox + 1} / {allMenuImages.length}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
