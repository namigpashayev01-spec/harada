'use client';

import { useEffect, useRef, useState } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import { WorkingDay } from '@/types/restaurant';

// "bazar ertəsi: 09:00–03:00 | çərşənbə axşamı: 09:00–03:00 | ..."
// formatındakı open_from string-ini WorkingDay[] massivine çevirir
function parseOpenFrom(str: string): WorkingDay[] {
  const AZ_DAY_MAP: Record<string, string> = {
    'bazar ertəsi': 'monday',
    'bazar ertesi': 'monday',
    'çərşənbə axşamı': 'tuesday',
    'cersенbе axsami': 'tuesday',
    'çərşənbə': 'wednesday',
    'cuma axsami': 'thursday',
    'cümə axşamı': 'thursday',
    'cümə': 'friday',
    'cume': 'friday',
    'şənbə': 'saturday',
    'senbe': 'saturday',
    'bazar': 'sunday',
  };

  const EN_DAY_MAP: Record<string, string> = {
    'monday': 'monday', 'tuesday': 'tuesday', 'wednesday': 'wednesday',
    'thursday': 'thursday', 'friday': 'friday', 'saturday': 'saturday', 'sunday': 'sunday',
  };

  const segments = str.split('|').map(s => s.trim()).filter(Boolean);
  const days: WorkingDay[] = [];

  for (const seg of segments) {
    const colonIdx = seg.indexOf(':');
    if (colonIdx === -1) continue;

    const rawDay = seg.slice(0, colonIdx).trim().toLowerCase();
    const timeStr = seg.slice(colonIdx + 1).trim();

    const dayKey = AZ_DAY_MAP[rawDay] ?? EN_DAY_MAP[rawDay];
    if (!dayKey) continue;

    // "09:00–03:00" → start/end
    const timeMatch = timeStr.match(/(\d{1,2}:\d{2})\s*[–\-]\s*(\d{1,2}:\d{2})/);
    if (!timeMatch) continue;

    days.push({
      day: dayKey as WorkingDay['day'],
      day_name: rawDay,
      is_open: true,
      meals: [{ start_time: timeMatch[1], end_time: timeMatch[2] }],
    });
  }

  return days;
}

interface OpeningHoursProps {
  workingHours: WorkingDay[];
  /** Fallback opening time when no structured working_hours are available. */
  openFrom?: string;
  lang: string;
  /** "card" = inline grid cell, "sidebar" = compact quick-info row. */
  variant?: 'card' | 'sidebar';
}

interface Dict {
  title: string;
  openNow: string;
  closedNow: string;
  opensAt: (v: string) => string;
  closedAllDay: string;
  fallbackOpenFrom: (v: string) => string;
  days: Record<string, string>;
}

const DICT: Record<string, Dict> = {
  az: {
    title: 'İş saatları',
    openNow: 'İndi açıqdır',
    closedNow: 'İndi bağlıdır',
    opensAt: (v) => `${v}-dan açılır`,
    closedAllDay: 'Bağlı',
    fallbackOpenFrom: (v) => `${v}-dan açıqdır`,
    days: {
      monday: 'Bazar ertəsi',
      tuesday: 'Çərşənbə axşamı',
      wednesday: 'Çərşənbə',
      thursday: 'Cümə axşamı',
      friday: 'Cümə',
      saturday: 'Şənbə',
      sunday: 'Bazar',
    },
  },
  en: {
    title: 'Opening hours',
    openNow: 'Open now',
    closedNow: 'Closed now',
    opensAt: (v) => `Opens at ${v}`,
    closedAllDay: 'Closed',
    fallbackOpenFrom: (v) => `Open from ${v}`,
    days: {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
    },
  },
  ru: {
    title: 'Часы работы',
    openNow: 'Открыто сейчас',
    closedNow: 'Сейчас закрыто',
    opensAt: (v) => `Открывается в ${v}`,
    closedAllDay: 'Закрыто',
    fallbackOpenFrom: (v) => `Открыто с ${v}`,
    days: {
      monday: 'Понедельник',
      tuesday: 'Вторник',
      wednesday: 'Среда',
      thursday: 'Четверг',
      friday: 'Пятница',
      saturday: 'Суббота',
      sunday: 'Воскресенье',
    },
  },
};

const WEEK_ORDER = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

const DAY_BY_INDEX = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

// Trim "09:00:00" → "09:00" and leave already-short values untouched.
const hhmm = (v?: string) => (v ? v.slice(0, 5) : '');

// Minutes since midnight for an "HH:MM" string, or null when unparsable.
const toMinutes = (v?: string): number | null => {
  const m = hhmm(v).match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
};

const minutesToHHMM = (mins: number) =>
  `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;

// Overall open→close span for a day, e.g. "08:00–23:00" (earliest start to
// latest end across all meal periods). Returns "" when no valid times exist.
const daySpan = (day: WorkingDay): string => {
  const meals = day.meals
    .map((m) => ({ s: toMinutes(m.start_time), e: toMinutes(m.end_time) }))
    .filter((m): m is { s: number; e: number } => m.s != null && m.e != null)
    .sort((a, b) => a.s - b.s);
  if (!meals.length) return '';
  // Open = earliest start; close = end of the latest-starting meal, which may
  // wrap past midnight (e.g. dinner 15:00–02:00).
  const open = meals[0].s;
  const close = meals[meals.length - 1].e;
  return `${minutesToHHMM(open)}–${minutesToHHMM(close)}`;
};

export default function OpeningHours({
  workingHours,
  openFrom,
  lang,
  variant = 'card',
}: OpeningHoursProps) {
  const t = DICT[lang] ?? DICT.az;
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // open_from string varsa parse et və workingHours ilə birləşdir
  const parsedFromStr = openFrom ? parseOpenFrom(openFrom) : [];
  const effectiveHours = workingHours.length > 0 ? workingHours : parsedFromStr;

  // Close the popover on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Nə structured schedule, nə də parseable open_from yoxdur
  if (!effectiveHours.length) {
    return null;
  }

  const byDay = new Map(effectiveHours.map((d) => [d.day, d]));
  const orderedDays = WEEK_ORDER.map((d) => byDay.get(d)).filter(
    (d): d is WorkingDay => Boolean(d),
  );

  const now = new Date();
  const todayKey = DAY_BY_INDEX[now.getDay()];
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const today = byDay.get(todayKey);

  // Live status: open now / opens later today / closed.
  let isOpenNow = false;
  let opensAtToday: string | null = null;
  if (today?.is_open) {
    for (const meal of today.meals) {
      const start = toMinutes(meal.start_time);
      const end = toMinutes(meal.end_time);
      if (start == null || end == null) continue;
      // Overnight period (e.g. 16:00–02:00) wraps past midnight.
      const openNow =
        end < start
          ? nowMinutes >= start || nowMinutes <= end
          : nowMinutes >= start && nowMinutes <= end;
      if (openNow) {
        isOpenNow = true;
        break;
      }
      if (nowMinutes < start && (opensAtToday == null || start < toMinutes(opensAtToday)!)) {
        opensAtToday = hhmm(meal.start_time);
      }
    }
  }

  const statusLabel = isOpenNow
    ? t.openNow
    : opensAtToday
      ? t.opensAt(opensAtToday)
      : t.closedNow;
  const todayOpen = Boolean(today?.is_open);
  const todaySpan = today && todayOpen ? daySpan(today) : '';

  const iconSize = variant === 'sidebar' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex w-full items-center gap-2.5 rounded-xl text-left transition-colors hover:text-[#006653]">
        <Clock className={`${iconSize} text-gray-400 flex-shrink-0`} />
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {todaySpan && (
            <span className="font-semibold text-gray-900">{todaySpan}</span>
          )}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
              isOpenNow
                ? 'bg-[#9fe870]/25 text-[#14532d]'
                : 'bg-gray-100 text-gray-500'
            }`}>
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isOpenNow ? 'bg-[#006653]' : 'bg-gray-400'
              }`}
            />
            {statusLabel}
          </span>
        </span>
        <ChevronDown
          className={`ml-auto h-4 w-4 text-gray-400 transition-transform group-hover:text-[#006653] ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl sm:right-auto sm:w-72">
          <div className="border-b border-gray-100 bg-gray-50 px-4 py-2.5">
            <p className="text-sm font-bold text-gray-900">{t.title}</p>
          </div>
          <ul className="py-1">
            {orderedDays.map((d) => {
              const isToday = d.day === todayKey;
              const closed = !d.is_open;
              return (
                <li
                  key={d.day}
                  className={`flex items-center justify-between gap-4 px-4 py-2 text-sm ${
                    isToday ? 'bg-[#9fe870]/15' : ''
                  }`}>
                  <span
                    className={`${
                      isToday ? 'font-bold text-[#14532d]' : 'text-gray-600'
                    }`}>
                    {t.days[d.day] ?? d.day_name ?? d.day}
                  </span>
                  <span
                    className={`text-right ${
                      closed
                        ? 'text-gray-400'
                        : isToday
                          ? 'font-semibold text-gray-900'
                          : 'text-gray-700'
                    }`}>
                    {closed ? t.closedAllDay : daySpan(d)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
