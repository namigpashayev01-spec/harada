'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SlidersHorizontal, Tag, Check, X } from 'lucide-react';
import propertyService from '@/services/property.service';
import { Property } from '@/types/restaurant';
import { cn } from '@/lib/utils';

export interface FilterSelection {
  properties: number[];
  subproperties: number[];
  is_special_offer: boolean;
}

interface HeroFilterProps {
  value: FilterSelection;
  onChange: (v: FilterSelection) => void;
  onApply: () => void;
  lang: string;
  compact?: boolean;
}

const LABELS: Record<
  string,
  {
    filter: string;
    title: string;
    subtitle: string;
    offers: string;
    offer: string;
    clear: string;
    apply: string;
    empty: string;
  }
> = {
  az: {
    filter: 'Filtr',
    title: 'Filtrlər',
    subtitle: 'Mətbəx, məkan tipi və təkliflər',
    offers: 'Təkliflər',
    offer: 'Endirimli',
    clear: 'Təmizlə',
    apply: 'Nəticələri göstər',
    empty: 'Filtrlər yüklənir...',
  },
  en: {
    filter: 'Filter',
    title: 'Filters',
    subtitle: 'Cuisine, venue type and offers',
    offers: 'Offers',
    offer: 'Special offer',
    clear: 'Clear',
    apply: 'Show results',
    empty: 'Loading filters...',
  },
  ru: {
    filter: 'Фильтр',
    title: 'Фильтры',
    subtitle: 'Кухня, тип заведения и предложения',
    offers: 'Предложения',
    offer: 'Со скидкой',
    clear: 'Очистить',
    apply: 'Показать',
    empty: 'Загрузка фильтров...',
  },
};

export default function HeroFilter({
  value,
  onChange,
  onApply,
  lang,
  compact = false,
}: HeroFilterProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const t = LABELS[lang] ?? LABELS.az;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    propertyService
      .getProperties()
      .then((res) => setProperties(res.data))
      .catch(() => {});
  }, []);

  // Position the desktop dropdown under the trigger (it's portaled to <body>
  // so an ancestor's overflow-hidden can't clip it).
  const updatePos = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = 440;
    const margin = 8;
    let left = r.right - width;
    left = Math.min(Math.max(left, margin), window.innerWidth - width - margin);
    setPos({ top: r.bottom + margin, left });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePos();
    window.addEventListener('resize', updatePos);
    window.addEventListener('scroll', updatePos, true);
    return () => {
      window.removeEventListener('resize', updatePos);
      window.removeEventListener('scroll', updatePos, true);
    };
  }, [open, updatePos]);

  // Close on outside click (clicks inside the trigger or the portaled panels
  // are ignored).
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (wrapRef.current?.contains(target)) return;
      if (portalRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // Lock body scroll on mobile while the sheet is open
  useEffect(() => {
    if (!open) return;
    const isMobile = window.matchMedia('(max-width: 639px)').matches;
    if (!isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const count =
    value.subproperties.length +
    value.properties.length +
    (value.is_special_offer ? 1 : 0);

  const toggleSub = (id: number) => {
    const has = value.subproperties.includes(id);
    onChange({
      ...value,
      subproperties: has
        ? value.subproperties.filter((x) => x !== id)
        : [...value.subproperties, id],
    });
  };

  const toggleProp = (id: number) => {
    const has = value.properties.includes(id);
    onChange({
      ...value,
      properties: has
        ? value.properties.filter((x) => x !== id)
        : [...value.properties, id],
    });
  };

  const toggleOffer = () =>
    onChange({ ...value, is_special_offer: !value.is_special_offer });

  const clearAll = () =>
    onChange({ properties: [], subproperties: [], is_special_offer: false });

  const apply = () => {
    setOpen(false);
    onApply();
  };

  const fieldH = compact ? 'h-10' : 'h-14';

  const chip = (active: boolean) =>
    cn(
      'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors',
      active
        ? 'border-[#006653] bg-[#006653] text-white'
        : 'border-gray-200 bg-white text-gray-700 hover:border-[#006653]/50 hover:bg-[#eefae1]',
    );

  /* Shared scrollable list of filter groups. */
  const Groups = (
    <>
      {/* Special offer */}
      <div className="mb-5">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
          {t.offers}
        </p>
        <button onClick={toggleOffer} className={chip(value.is_special_offer)}>
          <Tag className="h-4 w-4" />
          {t.offer}
          {value.is_special_offer && <Check className="h-4 w-4" />}
        </button>
      </div>

      {properties.map((property) => (
        <div key={property.id} className="mb-5">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            {property.title}
          </p>
          {property.sub_properties.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {property.sub_properties.map((sub) => {
                const active = value.subproperties.includes(sub.id);
                return (
                  <button
                    key={sub.id}
                    onClick={() => toggleSub(sub.id)}
                    className={chip(active)}>
                    {sub.title}
                    {active && <Check className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <button
              onClick={() => toggleProp(property.id)}
              className={chip(value.properties.includes(property.id))}>
              {property.title}
              {value.properties.includes(property.id) && (
                <Check className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      ))}

      {properties.length === 0 && (
        <p className="py-6 text-center text-sm text-gray-400">{t.empty}</p>
      )}
    </>
  );

  const Header = (
    <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
      <div>
        <h3 className="text-base font-bold text-gray-900">{t.title}</h3>
        <p className="mt-0.5 text-xs text-gray-500">{t.subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        {count > 0 && (
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#006653] px-1.5 text-xs font-bold text-white">
            {count}
          </span>
        )}
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  const Footer = (
    <div className="flex items-center gap-3 border-t border-gray-100 px-5 py-3.5">
      <button
        onClick={clearAll}
        disabled={count === 0}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40">
        <X className="h-4 w-4" />
        {t.clear}
      </button>
      <button
        onClick={apply}
        className="ml-auto rounded-xl bg-[#9fe870] px-6 py-2.5 text-sm font-bold text-[#14532d] transition-colors hover:bg-[#8fdc5c]">
        {t.apply}
        {count > 0 ? ` (${count})` : ''}
      </button>
    </div>
  );

  return (
    <div ref={wrapRef} className="relative flex-shrink-0">
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t.filter}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 rounded-xl border px-4 text-gray-700 transition-colors',
          fieldH,
          open
            ? 'border-[#006653] bg-[#eefae1]'
            : 'border-gray-200 bg-gray-50 hover:bg-gray-100 sm:bg-transparent',
        )}>
        <SlidersHorizontal className="h-5 w-5" />
        <span className="font-medium sm:hidden">{t.filter}</span>
        {count > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#006653] px-1 text-[11px] font-bold text-white">
            {count}
          </span>
        )}
      </button>

      {/* Portaled to <body> so an ancestor's overflow-hidden can't clip it. */}
      {mounted &&
        createPortal(
          <div ref={portalRef}>
            {/* Desktop dropdown */}
            {open && (
              <div
                style={{ top: pos.top, left: pos.left }}
                className="fixed z-[60] hidden w-[440px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.22)] sm:block">
                {Header}
                <div className="max-h-[55vh] overflow-y-auto px-5 py-4">{Groups}</div>
                {Footer}
              </div>
            )}

            {/* Mobile bottom sheet */}
            <div
              className={cn(
                'fixed inset-0 z-[70] bg-black/40 transition-opacity duration-200 sm:hidden',
                open ? 'opacity-100' : 'pointer-events-none opacity-0',
              )}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label={t.title}
              className={cn(
                'fixed inset-x-0 bottom-0 z-[71] flex max-h-[88vh] flex-col rounded-t-2xl bg-white shadow-2xl transition-transform duration-300 ease-out sm:hidden',
                open ? 'translate-y-0' : 'translate-y-full',
              )}>
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-gray-300" />
              </div>
              {Header}
              <div className="flex-1 overflow-y-auto px-5 py-4">{Groups}</div>
              <div className="pb-[max(env(safe-area-inset-bottom),0.5rem)]">
                {Footer}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
