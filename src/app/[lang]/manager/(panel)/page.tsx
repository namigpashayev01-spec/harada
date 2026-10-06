'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { CalendarCheck, Users, Ban, Loader2, Clock } from 'lucide-react';
import apiClient from '@/api';
import { useManager } from '@/components/Manager/ManagerShell';
import { managerDict } from '@/components/Manager/dict';

interface Summary {
  today: { guests: number; reservations: number };
  counts: { pending: number; confirmed: number };
}

const LABELS: Record<string, Record<string, string>> = {
  az: {
    today: 'Bu gün',
    guests: 'Gözlənilən qonaq',
    reservations: 'Rezervasiya',
    pending: 'Cavab gözləyir',
    confirmed: 'Təsdiqlənmiş (gələcək)',
    quick: 'Tez əməliyyatlar',
    markFull: 'Saatı dolu elan et',
    seeBookings: 'Rezervasiyalara bax',
    editHours: 'İş saatlarını dəyiş',
  },
  en: {
    today: 'Today',
    guests: 'Guests expected',
    reservations: 'Reservations',
    pending: 'Awaiting reply',
    confirmed: 'Confirmed (upcoming)',
    quick: 'Quick actions',
    markFull: 'Mark an hour as full',
    seeBookings: 'See reservations',
    editHours: 'Edit opening hours',
  },
  ru: {
    today: 'Сегодня',
    guests: 'Ожидается гостей',
    reservations: 'Броней',
    pending: 'Ждут ответа',
    confirmed: 'Подтверждено (далее)',
    quick: 'Быстрые действия',
    markFull: 'Отметить час занятым',
    seeBookings: 'Открыть брони',
    editHours: 'Изменить часы работы',
  },
};

export default function ManagerOverviewPage() {
  const { restaurant, lang } = useManager();
  const t = managerDict(lang);
  const l = LABELS[lang] ?? LABELS.az;

  const { data, isLoading } = useQuery({
    queryKey: ['owner', 'summary', restaurant.id],
    queryFn: () => apiClient.get<Summary>(`/owner/${restaurant.id}/summary`),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const cards = [
    { icon: Users, label: l.guests, value: data?.today.guests ?? 0, hint: l.today },
    {
      icon: CalendarCheck,
      label: l.reservations,
      value: data?.today.reservations ?? 0,
      hint: l.today,
    },
    {
      icon: Clock,
      label: l.pending,
      value: data?.counts.pending ?? 0,
      hint: '',
      accent: (data?.counts.pending ?? 0) > 0,
    },
    { icon: CalendarCheck, label: l.confirmed, value: data?.counts.confirmed ?? 0, hint: '' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">{restaurant.title}</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className={`rounded-xl border bg-white p-4 ${
                c.accent ? 'border-amber-200 bg-amber-50/40' : 'border-gray-100'
              }`}>
              <Icon className="h-5 w-5 text-gray-400" />
              <p className="mt-3 text-2xl font-semibold text-gray-900">{c.value}</p>
              <p className="text-sm text-gray-600">{c.label}</p>
              {c.hint && <p className="text-xs text-gray-400">{c.hint}</p>}
            </div>
          );
        })}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-gray-900">{l.quick}</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/${lang}/blocks`}
            className="rounded-lg bg-[#006653] px-4 py-2 text-sm font-medium text-white hover:bg-[#00543f]">
            <Ban className="mr-1.5 inline h-4 w-4" />
            {l.markFull}
          </Link>
          <Link
            href={`/${lang}/reservations`}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-200 hover:text-[#006653]">
            {l.seeBookings}
          </Link>
          <Link
            href={`/${lang}/hours`}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-200 hover:text-[#006653]">
            {l.editHours}
          </Link>
        </div>
      </div>

      <p className="text-xs text-gray-400">{t.brand} · harada-oturaq.az</p>
    </div>
  );
}
