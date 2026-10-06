'use client';
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Store,
  Loader2,
  Clock,
  Users,
  ExternalLink,
  Hourglass,
  XCircle,
  PlusCircle,
} from 'lucide-react';
import ownerService from '@/services/owner.service';

interface Dict {
  title: string;
  subtitle: string;
  none: string;
  noneCta: string;
  applications: string;
  pending: string;
  rejected: string;
  reason: string;
  capacity: (n: number) => string;
  noCapacity: string;
  bookingsOn: string;
  bookingsOff: string;
  view: string;
  manageReservations: string;
  newRestaurant: string;
}

const DICT: Record<string, Dict> = {
  az: {
    title: 'Restoranım',
    subtitle: 'İdarə etdiyiniz restoranlar və müraciətlərinizin vəziyyəti.',
    none: 'Hələ idarə etdiyiniz restoran yoxdur.',
    noneCta: 'Restoranınızın sahibliyini tələb edin',
    applications: 'Müraciətlərim',
    pending: 'Baxılır',
    rejected: 'Rədd edildi',
    reason: 'Səbəb',
    capacity: (n) => `Saatda ${n} qonaq`,
    noCapacity: 'Tutum limiti qoyulmayıb',
    bookingsOn: 'Rezervasiya açıqdır',
    bookingsOff: 'Rezervasiya bağlıdır',
    view: 'Səhifəyə bax',
    manageReservations: 'Rezervasiyaları idarə et',
    newRestaurant: 'Yeni restoran',
  },
  en: {
    title: 'My restaurant',
    subtitle: 'The restaurants you manage and the status of your applications.',
    none: 'You do not manage any restaurant yet.',
    noneCta: 'Claim your restaurant',
    applications: 'My applications',
    pending: 'Under review',
    rejected: 'Rejected',
    reason: 'Reason',
    capacity: (n) => `${n} guests per hour`,
    noCapacity: 'No capacity limit set',
    bookingsOn: 'Bookings open',
    bookingsOff: 'Bookings closed',
    view: 'View page',
    manageReservations: 'Manage bookings',
    newRestaurant: 'New restaurant',
  },
  ru: {
    title: 'Мой ресторан',
    subtitle: 'Рестораны под вашим управлением и статус заявок.',
    none: 'Вы пока не управляете ни одним рестораном.',
    noneCta: 'Заявить права на ресторан',
    applications: 'Мои заявки',
    pending: 'На рассмотрении',
    rejected: 'Отклонено',
    reason: 'Причина',
    capacity: (n) => `${n} гостей в час`,
    noCapacity: 'Лимит вместимости не задан',
    bookingsOn: 'Бронирование открыто',
    bookingsOff: 'Бронирование закрыто',
    view: 'Открыть страницу',
    manageReservations: 'Управлять бронями',
    newRestaurant: 'Новый ресторан',
  },
};

export default function OwnerRestaurantsPage() {
  const params = useParams();
  const lang = (params?.lang as string) ?? 'az';
  const t = DICT[lang] ?? DICT.en;

  const { data: owned, isLoading } = useQuery({
    queryKey: ['owner', 'restaurants'],
    queryFn: () => ownerService.getRestaurants(),
  });

  const { data: applications } = useQuery({
    queryKey: ['owner', 'applications'],
    queryFn: () => ownerService.getApplications(),
  });

  const restaurants = owned?.data ?? [];
  // Təsdiqlənmişlər yuxarıdakı kartlarda göstərilir — siyahıda təkrarlanmasın
  const openApplications = (applications?.data ?? []).filter(
    (a) => a.status !== 1,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{t.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{t.subtitle}</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : restaurants.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center">
          <Store className="mx-auto h-8 w-8 text-gray-300" />
          <p className="mt-3 text-sm text-gray-600">{t.none}</p>
          <Link
            href={`/${lang}/restaurant-register`}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#006653] px-4 py-2 text-sm font-medium text-white hover:bg-[#00543f]">
            <PlusCircle className="h-4 w-4" />
            {t.noneCta}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {restaurants.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-gray-900">{r.title}</h2>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    r.reservation_enabled
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}>
                  {r.reservation_enabled ? t.bookingsOn : t.bookingsOff}
                </span>
              </div>

              <dl className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  {r.reservation_capacity
                    ? t.capacity(r.reservation_capacity)
                    : t.noCapacity}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  {t.bookingsOn}
                </div>
              </dl>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <Link
                  href={`/${lang}/dashboard/restaurant/reservations`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#006653] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#00543f]">
                  {t.manageReservations}
                </Link>
                <Link
                  href={`/${lang}/places/${r.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#006653] hover:underline">
                  {t.view}
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {openApplications.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">
            {t.applications}
          </h2>
          <ul className="space-y-2">
            {openApplications.map((a) => (
              <li
                key={a.id}
                className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4">
                {a.status === 0 ? (
                  <Hourglass className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                ) : (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {a.title}
                    {a.is_new_restaurant && (
                      <span className="ml-2 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-normal text-blue-700">
                        {t.newRestaurant}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {a.status === 0 ? t.pending : t.rejected}
                    {a.reject_reason ? ` · ${t.reason}: ${a.reject_reason}` : ''}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
