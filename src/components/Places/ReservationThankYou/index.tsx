'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Compass,
  CheckCircle2,
  Clock,
  CalendarDays,
  Users,
  Hash,
  MapPin,
  Phone,
  MessageCircle,
} from 'lucide-react';
import placeService from '@/services/place.service';
import { pushEvent } from '@/lib/analytics';

/** Restoranın öz nömrəsi olmayanda rezervasiyalar bu xəttə gedir. */
const FALLBACK_WHATSAPP = '994773151580';

function waNumber(raw?: string | null) {
  const digits = (raw ?? '').replace(/\D/g, '');
  return digits.length >= 9 ? digits : null;
}

interface Dict {
  heading: string;
  lead: string;
  waitNote: string;
  summary: string;
  date: string;
  time: string;
  guests: string;
  bookingNo: string;
  whatsapp: string;
  whatsappHint: string;
  call: string;
  backToPlace: string;
  browse: string;
  guestsUnit: (n: number) => string;
}

const DICT: Record<string, Dict> = {
  az: {
    heading: 'Rezervasiyanız göndərildi',
    lead: 'Sorğunuz restorana çatdı.',
    waitNote:
      'Zəhmət olmasa restorandan təsdiq cavabı gələnə qədər gözləyin — təsdiq aldıqdan sonra restorana yaxınlaşın.',
    summary: 'Rezervasiya məlumatları',
    date: 'Tarix',
    time: 'Saat',
    guests: 'Qonaq sayı',
    bookingNo: 'Rezervasiya nömrəsi',
    whatsapp: 'WhatsApp ilə əlaqə saxla',
    whatsappHint:
      'WhatsApp özü açılmadısa və ya bağlandısa, bu düymə ilə restorana birbaşa yaza bilərsiniz.',
    call: 'Zəng et',
    backToPlace: 'Restoran səhifəsinə qayıt',
    browse: 'Başqa məkanlara bax',
    guestsUnit: (n) => `${n} nəfər`,
  },
  en: {
    heading: 'Your reservation has been sent',
    lead: 'Your request reached the restaurant.',
    waitNote:
      'Please wait for the restaurant to confirm — go to the restaurant once you have the confirmation.',
    summary: 'Reservation details',
    date: 'Date',
    time: 'Time',
    guests: 'Guests',
    bookingNo: 'Booking number',
    whatsapp: 'Contact on WhatsApp',
    whatsappHint:
      'If WhatsApp did not open, or you closed it, use this button to message the restaurant directly.',
    call: 'Call',
    backToPlace: 'Back to the restaurant',
    browse: 'Browse other places',
    guestsUnit: (n) => `${n} ${n === 1 ? 'person' : 'people'}`,
  },
  ru: {
    heading: 'Ваша бронь отправлена',
    lead: 'Заявка дошла до ресторана.',
    waitNote:
      'Пожалуйста, дождитесь подтверждения от ресторана — приходите после того, как получите подтверждение.',
    summary: 'Детали брони',
    date: 'Дата',
    time: 'Время',
    guests: 'Гостей',
    bookingNo: 'Номер брони',
    whatsapp: 'Написать в WhatsApp',
    whatsappHint:
      'Если WhatsApp не открылся или вы его закрыли, напишите ресторану этой кнопкой.',
    call: 'Позвонить',
    backToPlace: 'Вернуться к ресторану',
    browse: 'Другие места',
    guestsUnit: (n) => `${n} чел.`,
  },
};

export default function ReservationThankYou({ lang }: { lang: string }) {
  const t = DICT[lang] ?? DICT.en;
  const search = useSearchParams();

  const slug = search.get('r') ?? '';
  const booking = search.get('b') ?? '';
  const date = search.get('d') ?? '';
  const time = search.get('t') ?? '';
  const guests = Number(search.get('g') ?? 0);

  const [restaurant, setRestaurant] = useState<{
    title: string;
    address?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
  } | null>(null);

  useEffect(() => {
    if (!slug) return;
    placeService
      .getRestaurantBySlug(slug, lang)
      .then((res) => {
        const r = res?.data;
        if (!r) return;
        setRestaurant({
          title: r.title ?? '',
          address: r.address ?? null,
          phone: r.phone ?? null,
          whatsapp: r.whatsapp ?? null,
        });
      })
      .catch(() => setRestaurant(null));
  }, [slug, lang]);

  // Konversiya hadisəsi — GTM/GA4 bu səhifədən rezervasiyanı sayır
  useEffect(() => {
    pushEvent({
      event: 'reservation_completed',
      reservation_booking_id: booking || undefined,
      reservation_restaurant: slug || undefined,
      reservation_guests: guests || undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [storedMessage, setStoredMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const m = sessionStorage.getItem('reservation_wa_message');
      if (m) setStoredMessage(m);
    } catch {
      // sessionStorage bağlıdırsa qısa mətn işlədilir
    }
  }, []);

  const wa = waNumber(restaurant?.whatsapp) ?? FALLBACK_WHATSAPP;
  const waText = encodeURIComponent(
    storedMessage ??
    [
      t.heading,
      restaurant?.title ? `🍽 ${restaurant.title}` : null,
      date ? `📅 ${date}` : null,
      time ? `⏰ ${time}` : null,
      guests ? `👥 ${t.guestsUnit(guests)}` : null,
      booking ? `#${booking}` : null,
    ]
      .filter(Boolean)
      .join('\n'),
  );

  const rows = [
    { icon: CalendarDays, label: t.date, value: date },
    { icon: Clock, label: t.time, value: time },
    { icon: Users, label: t.guests, value: guests ? t.guestsUnit(guests) : '' },
    { icon: Hash, label: t.bookingNo, value: booking },
  ].filter((r) => r.value);

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:py-14">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:p-8">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eefae1]">
          <CheckCircle2 className="h-8 w-8 text-[#006653]" />
        </span>

        <h1 className="mt-5 text-xl font-semibold text-gray-900 sm:text-2xl">
          {t.heading}
        </h1>
        <p className="mt-2 text-sm text-gray-500">{t.lead}</p>

        {restaurant?.title && (
          <p className="mt-4 font-medium text-gray-900">{restaurant.title}</p>
        )}
        {restaurant?.address && (
          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-gray-500">
            <MapPin className="h-3.5 w-3.5" />
            {restaurant.address}
          </p>
        )}

        {/* Əsas mesaj — müştəri təsdiqi gözləməlidir */}
        <p className="mt-6 rounded-xl bg-amber-50 p-4 text-left text-sm leading-relaxed text-amber-900">
          {t.waitNote}
        </p>

        {rows.length > 0 && (
          <div className="mt-6 text-left">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
              {t.summary}
            </p>
            <dl className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-100">
              {rows.map((r) => {
                const Icon = r.icon;
                return (
                  <div
                    key={r.label}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm">
                    <Icon className="h-4 w-4 shrink-0 text-gray-400" />
                    <dt className="text-gray-500">{r.label}</dt>
                    <dd className="ml-auto font-medium text-gray-900">
                      {r.value}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        )}

        <a
          href={`https://wa.me/${wa}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          id="reservation-thankyou-whatsapp"
          data-gtm="reservation_thankyou_whatsapp"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 font-semibold text-white transition-colors hover:bg-[#1da851]">
          <MessageCircle className="h-5 w-5" />
          {t.whatsapp}
        </a>
        <p className="mt-2 text-xs text-gray-400">{t.whatsappHint}</p>

        {restaurant?.phone && (
          <a
            href={`tel:${restaurant.phone.replace(/\s/g, '')}`}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-[#006653] hover:text-[#006653]">
            <Phone className="h-4 w-4" />
            {t.call} · {restaurant.phone}
          </a>
        )}

        <div className="mt-6 space-y-3 border-t border-gray-100 pt-6">
          {slug && (
            <Link
              href={`/${lang}/places/${slug}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#006653] px-5 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#00543f]">
              <ArrowLeft className="h-5 w-5" />
              {t.backToPlace}
            </Link>
          )}
          <Link
            href={`/${lang}/places`}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#006653] px-5 py-3 text-base font-semibold text-[#006653] transition-colors hover:bg-[#eefae1]">
            <Compass className="h-5 w-5" />
            {t.browse}
          </Link>
        </div>
      </div>
    </div>
  );
}
