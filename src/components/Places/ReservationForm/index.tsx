'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { az as azLocale, enUS, ru as ruLocale } from 'date-fns/locale';
import type { Locale } from 'date-fns';
import 'react-day-picker/style.css';
import { CheckCircle2, Phone, Users } from 'lucide-react';
import reservationService, {
  AvailabilityResponse,
  SlotStatus,
} from '@/services/reservation.service';
import { Restaurant } from '@/types/restaurant';

const DAY_NAMES = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

const DP_LOCALES: Record<string, Locale> = {
  az: azLocale,
  en: enUS,
  ru: ruLocale,
};

const SITE_URL = 'https://harada-oturaq.az';

const GUEST_MIN = 1;
const GUEST_MAX = 50;

/** Keep a party size inside the bookable range, whatever was typed. */
function clampGuests(n: number) {
  if (!Number.isFinite(n)) return GUEST_MIN;
  return Math.min(GUEST_MAX, Math.max(GUEST_MIN, Math.floor(n)));
}

/** Wording of the WhatsApp message, in the language the visitor booked in. */
const MSG: Record<
  string,
  {
    heading: string;
    date: string;
    meal: string;
    time: string;
    guests: string;
    guestsUnit: (n: number) => string;
    bookedBy: string;
    name: string;
    phone: string;
    footer: string;
  }
> = {
  az: {
    heading: 'YENİ MASA REZERVASİYASI',
    date: 'Tarix',
    meal: 'Yemək vaxtı',
    time: 'Saat',
    guests: 'Qonaq sayı',
    guestsUnit: (n) => `${n} nəfər`,
    bookedBy: 'REZERV EDƏN',
    name: 'Ad',
    phone: 'Telefon',
    footer: 'Harada Oturaq vasitəsilə göndərildi',
  },
  en: {
    heading: 'NEW TABLE RESERVATION',
    date: 'Date',
    meal: 'Meal time',
    time: 'Time',
    guests: 'Guests',
    guestsUnit: (n) => `${n} ${n === 1 ? 'person' : 'people'}`,
    bookedBy: 'BOOKED BY',
    name: 'Name',
    phone: 'Phone',
    footer: 'Sent via Harada Oturaq',
  },
  ru: {
    heading: 'НОВОЕ БРОНИРОВАНИЕ СТОЛИКА',
    date: 'Дата',
    meal: 'Время приёма пищи',
    time: 'Время',
    guests: 'Гостей',
    guestsUnit: (n) => `${n} чел.`,
    bookedBy: 'БРОНИРУЕТ',
    name: 'Имя',
    phone: 'Телефон',
    footer: 'Отправлено через Harada Oturaq',
  },
};

/**
 * Group a digits-only number so the recipient can read it back over the phone.
 * Handles the local forms people actually type: 0501234567, 501234567 and
 * 994501234567 all become +994 50 123 45 67.
 */
function prettyPhone(digits: string) {
  let d = digits;
  if (d.startsWith('994')) d = d.slice(3);
  else if (d.startsWith('0')) d = d.slice(1);
  if (d.length !== 9) return `+${digits}`; // unexpected shape — show it as typed
  return `+994 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7)}`;
}

interface Dict {
  reservationConfirmed: string;
  seeYouAt: (title: string) => string;
  makeAnother: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  closedDay: string;
  guests: string;
  guestNameLabel: string;
  guestNamePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  booking: string;
  bookTable: string;
  loadingHours: string;
  slotFull: string;
  slotBlocked: string;
  dayFull: string;
  dayBlocked: string;
  reservationsClosed: string;
  seatsLeft: (n: number) => string;
  slotTakenError: string;
}

const DICT: Record<string, Dict> = {
  az: {
    reservationConfirmed: 'Rezervasiya təsdiqləndi!',
    seeYouAt: (title) => `${title} məkanında görüşərik.`,
    makeAnother: 'Yeni rezervasiya et',
    step1: '1. Tarix seçin',
    step2: '2. Yemək vaxtı seçin',
    step3: '3. Saat seçin',
    step4: '4. Məlumatlarınız',
    closedDay: 'Seçilmiş gündə bu restoran bağlıdır.',
    guests: 'Qonaq sayı',
    guestNameLabel: 'Qonağın adı',
    guestNamePlaceholder: 'Rezervasiya edən şəxsin adı',
    phoneLabel: 'Telefon nömrəsi',
    phonePlaceholder: 'Mobil nömrə',
    booking: 'Rezerv olunur…',
    bookTable: 'Masa rezerv et',
    loadingHours: 'Boş saatlar yoxlanılır…',
    slotFull: 'Dolu',
    slotBlocked: 'Bağlı',
    dayFull: 'Bu gün üçün boş saat qalmayıb.',
    dayBlocked: 'Restoran bu gün rezervasiya qəbul etmir.',
    reservationsClosed: 'Bu restoran hazırda onlayn rezervasiya qəbul etmir.',
    seatsLeft: (n) => `${n} yer qalıb`,
    slotTakenError:
      'Təəssüf ki, bu saat indicə doldu. Zəhmət olmasa başqa saat seçin.',
  },
  en: {
    reservationConfirmed: 'Reservation Confirmed!',
    seeYouAt: (title) => `We'll see you at ${title}.`,
    makeAnother: 'Make another reservation',
    step1: '1. Choose date',
    step2: '2. Choose meal time',
    step3: '3. Choose time slot',
    step4: '4. Your details',
    closedDay: 'This restaurant is closed on the selected day.',
    guests: 'Number of guests',
    guestNameLabel: 'Guest name',
    guestNamePlaceholder: 'Name for person who is booking',
    phoneLabel: 'Phone number',
    phonePlaceholder: 'Mobile number',
    booking: 'Booking…',
    bookTable: 'Book a Table',
    loadingHours: 'Checking free times…',
    slotFull: 'Full',
    slotBlocked: 'Closed',
    dayFull: 'No free times left for this day.',
    dayBlocked: 'The restaurant is not taking bookings on this day.',
    reservationsClosed: 'This restaurant is not taking online bookings.',
    seatsLeft: (n) => `${n} seats left`,
    slotTakenError:
      'Sorry, this time slot just filled up. Please pick another time.',
  },
  ru: {
    reservationConfirmed: 'Бронь подтверждена!',
    seeYouAt: (title) => `Ждём вас в ${title}.`,
    makeAnother: 'Новое бронирование',
    step1: '1. Выберите дату',
    step2: '2. Выберите время приёма пищи',
    step3: '3. Выберите время',
    step4: '4. Ваши данные',
    closedDay: 'В выбранный день ресторан закрыт.',
    guests: 'Количество гостей',
    guestNameLabel: 'Имя гостя',
    guestNamePlaceholder: 'Имя бронирующего',
    phoneLabel: 'Номер телефона',
    phonePlaceholder: 'Мобильный номер',
    booking: 'Бронирование…',
    bookTable: 'Забронировать',
    loadingHours: 'Проверяем свободное время…',
    slotFull: 'Занято',
    slotBlocked: 'Закрыто',
    dayFull: 'На этот день свободного времени не осталось.',
    dayBlocked: 'В этот день ресторан не принимает брони.',
    reservationsClosed: 'Ресторан не принимает онлайн-бронирование.',
    seatsLeft: (n) => `Осталось мест: ${n}`,
    slotTakenError:
      'К сожалению, это время только что заняли. Выберите другое время.',
  },
};

interface ReservationFormProps {
  restaurant: Restaurant;
  lang: string;
  /** Fired once a booking has been sent, so a host sheet/modal can close. */
  onDone?: () => void;
}

/**
 * The four-step booking flow (date → meal → hour → guest details), shared by
 * the restaurant detail page and the menu page. It owns all of its own state,
 * so each place that mounts it gets an independent form.
 */
export default function ReservationForm({
  restaurant,
  lang,
  onDone,
}: ReservationFormProps) {
  const t = DICT[lang] ?? DICT.en;
  const dpLocale = DP_LOCALES[lang] ?? azLocale;
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  // The field holds its own text so it can be cleared and retyped. Empty is a
  // legitimate mid-edit state, so it is not auto-filled — booking is blocked
  // until a number is there, rather than a silent default being sent.
  const [guestDraft, setGuestDraft] = useState(String(GUEST_MIN));
  const guestCount = Number(guestDraft);
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [reserving, setReserving] = useState(false);
  const [reservationDone, setReservationDone] = useState(false);
  const [reservationError, setReservationError] = useState('');

  const [availability, setAvailability] = useState<AvailabilityResponse | null>(
    null,
  );
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const workingHours = restaurant.working_hours ?? [];
  const selectedDayName = selectedDate ? DAY_NAMES[selectedDate.getDay()] : null;
  const workingDay = workingHours.find((d) => d.day === selectedDayName);
  const currentMeal = workingDay?.meals.find((m) => m.type === selectedMeal);

  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate(),
    ).padStart(2, '0')}`;

  // Tarix seçiləndə həmin gün üçün boş/dolu saatları gətiririk. Sorğu
  // alınmasa forma köhnə davranışla (bütün saatlar açıq) işləməyə davam edir —
  // yer yoxdursa server onsuz da rezervasiyanı rədd edəcək.
  useEffect(() => {
    if (!selectedDate) {
      setAvailability(null);
      return;
    }
    let cancelled = false;
    setAvailabilityLoading(true);
    reservationService
      .getAvailability(restaurant.id, formatDate(selectedDate))
      .then((res) => {
        if (!cancelled) setAvailability(res ?? null);
      })
      .catch(() => {
        if (!cancelled) setAvailability(null);
      })
      .finally(() => {
        if (!cancelled) setAvailabilityLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, restaurant.id]);

  /** Saatın vəziyyəti — doluluq məlumatı gəlməyibsə hamısı açıq sayılır. */
  const slotStateOf = (hour: string): { status: SlotStatus; remaining: number | null } => {
    const meal = availability?.meals.find((m) => m.type === selectedMeal);
    const found = meal?.hours.find((h) => h.time === hour);
    return found
      ? { status: found.status, remaining: found.remaining }
      : { status: 'available', remaining: null };
  };

  // Doluluq yenilənəndə seçilmiş saat artıq boş deyilsə, seçimi götürürük ki,
  // istifadəçi dolu saatla 4-cü addıma keçməsin.
  useEffect(() => {
    if (!selectedTime || !availability) return;
    const meal = availability.meals.find((m) => m.type === selectedMeal);
    const found = meal?.hours.find((h) => h.time === selectedTime);
    if (found && found.status !== 'available') setSelectedTime(null);
  }, [availability, selectedMeal, selectedTime]);

  const resetReservation = () => {
    setReservationDone(false);
    setSelectedDate(undefined);
    setSelectedMeal(null);
    setSelectedTime(null);
    setGuestName('');
    setPhone('');
    setGuestDraft(String(GUEST_MIN));
  };

  const handleReservation = async () => {
    if (!selectedDate || !selectedTime || !guestName || !phone || !guestDraft)
      return;
    setReserving(true);
    setReservationError('');

    // Build the reservation message and open the WhatsApp chat with it
    // pre-filled. *asterisks* are WhatsApp's bold syntax; the divider lines
    // keep the booking details scannable at a glance on a phone.
    const m = MSG[lang] ?? MSG.en;
    const mealLabel = currentMeal?.name ?? selectedMeal ?? '';
    const slug =
      restaurant.slug[lang as keyof typeof restaurant.slug] ||
      restaurant.slug.az ||
      restaurant.slug.en ||
      restaurant.slug.ru;
    // "24 iyul 2026, cümə axşamı" reads far better than "2026-07-24" for a
    // human taking the booking.
    const longDate = format(selectedDate, 'd MMMM yyyy, EEEE', {
      locale: dpLocale,
    });
    const divider = '➖➖➖➖➖➖➖➖';

    const message = [
      `*${m.heading}*`,
      '',
      `🍽 *${restaurant.title}*`,
      restaurant.address ? `📍 ${restaurant.address}` : null,
      '',
      divider,
      '',
      `📅 *${m.date}:* ${longDate}`,
      `🕒 *${m.meal}:* ${mealLabel}`,
      `⏰ *${m.time}:* ${selectedTime}`,
      `👥 *${m.guests}:* ${m.guestsUnit(guestCount)}`,
      '',
      divider,
      '',
      `*${m.bookedBy}*`,
      `🙍 ${m.name}: ${guestName}`,
      `📞 ${m.phone}: ${prettyPhone(phone)}`,
      slug ? '' : null,
      slug ? `🔗 ${SITE_URL}/${lang}/places/${slug}` : null,
      '',
      `_${m.footer}_`,
    ]
      .filter((line) => line !== null)
      .join('\n');
    // WhatsApp ARTIQ AVTOMATIK AÇILMIR: rezervasiya yazıldıqdan sonra
    // istifadəçi təşəkkür səhifəsinə keçir və mesajı oradan özü göndərir.
    // Hazırlanan mətn həmin səhifəyə ötürülür.
    try {
      const created = await reservationService.create({
        restoran_id: restaurant.id,
        date: formatDate(selectedDate),
        time_slot: selectedMeal!,
        time: selectedTime,
        guest_count: guestCount,
        guest_names: guestName,
        phone,
      });
      // Yönləndirmə tamamlanana qədər formada uğur ekranı görünsün
      setReservationDone(true);
      onDone?.();

      // Təşəkkür səhifəsi: müştəriyə "təsdiq gözləyin" mesajı verilir və
      // WhatsApp bloklanıbsa oradan yenidən yazmaq imkanı qalır.
      const params = new URLSearchParams({
        r: slug ?? '',
        d: formatDate(selectedDate),
        t: selectedTime,
        g: String(guestCount),
      });
      // Tam mesaj mətni — təşəkkür səhifəsindəki WhatsApp düyməsi bunu işlədir
      try {
        sessionStorage.setItem('reservation_wa_message', message);
      } catch {
        // sessionStorage bağlıdırsa səhifə öz qısa mətnini qurur
      }
      const bookingId = (
        created as { data?: { booking_id?: number | string | null } } | undefined
      )?.data?.booking_id;
      if (bookingId) params.set('b', String(bookingId));

      router.push(`/${lang}/reservation/thank-you?${params.toString()}`);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      const serverMessage = (
        err as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;
      // 422 = saat dolub/bağlıdır. Doluluğu yeniləyirik ki, düymələr dərhal
      // yenilənsin və istifadəçi başqa saat seçə bilsin.
      setReservationError(
        status === 422 ? serverMessage || t.slotTakenError : t.slotTakenError,
      );
      if (status === 422) {
        reservationService
          .getAvailability(restaurant.id, formatDate(selectedDate))
          .then((res) => setAvailability(res ?? null))
          .catch(() => undefined);
      }
    } finally {
      setReserving(false);
    }
  };

  if (reservationDone) {
    return (
      <div className="p-8 flex flex-col items-center text-center gap-3">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <p className="font-semibold text-gray-900 text-lg">
          {t.reservationConfirmed}
        </p>
        <p className="text-sm text-gray-500">{t.seeYouAt(restaurant.title)}</p>
        <button
          onClick={resetReservation}
          className="mt-2 text-sm text-[#006653] underline underline-offset-2">
          {t.makeAnother}
        </button>
      </div>
    );
  }

  return (
    <>
      {availability && !availability.reservation_enabled && (
        <div className="p-4 text-center text-sm text-amber-800 bg-amber-50 border-b border-amber-100">
          {t.reservationsClosed}
        </div>
      )}

      {/* Step 1 — Date */}
      <div className="p-4 border-b border-gray-100">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          {t.step1}
        </p>
        <DayPicker
          mode="single"
          locale={dpLocale}
          style={
            {
              '--rdp-accent-color': '#006653',
              '--rdp-accent-background-color': '#eefae1',
              '--rdp-today-color': '#006653',
            } as React.CSSProperties
          }
          selected={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date);
            setSelectedMeal(null);
            setSelectedTime(null);
          }}
          disabled={(date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (date < today) return true;
            if (!workingHours.length) return false;
            const dn = DAY_NAMES[date.getDay()];
            return !workingHours.find((d) => d.day === dn)?.is_open;
          }}
        />
      </div>

      {/* Step 2 — Meal type */}
      {selectedDate &&
        workingDay &&
        (workingDay.is_open ? (
          <div className="p-4 border-b border-gray-100">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
              {t.step2}
            </p>
            <div className="flex flex-wrap gap-2">
              {workingDay.meals.map((meal) => (
                <button
                  key={meal.type}
                  onClick={() => {
                    setSelectedMeal(meal.type);
                    setSelectedTime(null);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    selectedMeal === meal.type
                      ? 'bg-[#006653] text-white border-[#006653]'
                      : 'border-gray-200 text-gray-700 hover:border-[#006653] hover:text-[#006653]'
                  }`}>
                  {meal.name}
                  {availability?.meals.find((m) => m.type === meal.type)
                    ?.available_count === 0 && (
                    <span className="ml-1.5 text-[10px] font-normal opacity-70">
                      · {t.slotFull}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 border-b border-gray-100">
            {t.closedDay}
          </div>
        ))}

      {/* Step 3 — Time slot */}
      {selectedMeal && currentMeal && (
        <div className="p-4 border-b border-gray-100">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
            {t.step3}
          </p>
          {availabilityLoading && (
            <p className="text-xs text-gray-400 mb-2">{t.loadingHours}</p>
          )}
          <div className="grid grid-cols-3 gap-2">
            {currentMeal.hours.map((h) => {
              const { status, remaining } = slotStateOf(h);
              const taken = status !== 'available';
              const selected = selectedTime === h;
              return (
                <button
                  key={h}
                  type="button"
                  disabled={taken}
                  aria-disabled={taken}
                  onClick={() => !taken && setSelectedTime(h)}
                  className={`py-2 px-1 text-sm font-medium rounded-lg border transition-colors ${
                    taken
                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      : selected
                        ? 'bg-[#006653] text-white border-[#006653]'
                        : 'border-gray-200 text-gray-600 hover:border-[#006653] hover:text-[#006653]'
                  }`}>
                  <span className={taken ? 'line-through' : undefined}>{h}</span>
                  {status === 'full' && (
                    <span className="block text-[10px] font-normal leading-tight">
                      {t.slotFull}
                    </span>
                  )}
                  {status === 'blocked' && (
                    <span className="block text-[10px] font-normal leading-tight">
                      {t.slotBlocked}
                    </span>
                  )}
                  {/* Son yerlər qalanda tələsdirici işarə */}
                  {!taken && remaining !== null && remaining <= 5 && (
                    <span className="block text-[10px] font-normal leading-tight text-amber-600">
                      {t.seatsLeft(remaining)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {!availabilityLoading &&
            currentMeal.hours.length > 0 &&
            currentMeal.hours.every((h) => slotStateOf(h).status !== 'available') && (
              <p className="mt-3 text-sm text-center text-gray-500 bg-gray-50 rounded-lg py-2">
                {availability?.whole_day_blocked ? t.dayBlocked : t.dayFull}
              </p>
            )}
        </div>
      )}

      {/* Step 4 — Guest details */}
      {selectedTime && (
        <div className="p-4 space-y-3">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            {t.step4}
          </p>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
              <Users className="h-3.5 w-3.5" /> {t.guests}
            </label>
            {/*
              Deliberately NOT <input type="number">: a focused number input
              silently counts up or down when the wheel rolls over it, so a
              guest who picked 3 and then scrolled to the button below sent a
              booking for some other party size. Plain text with a digits-only
              filter types the same way but cannot drift on its own.
            */}
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              aria-label={t.guests}
              value={guestDraft}
              // Digits only; a leading zero is dropped, so "0" can never be
              // typed as a party size. Two digits is enough — 50 is the top.
              onChange={(e) =>
                setGuestDraft(
                  e.target.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 2),
                )
              }
              // Only the upper bound is corrected here; an empty field is left
              // empty so a half-finished edit is never overwritten.
              onBlur={() =>
                setGuestDraft((d) =>
                  d === '' ? d : String(clampGuests(Number(d))),
                )
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#006653]/30 focus:border-[#006653]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">
              {t.guestNameLabel}
            </label>
            <input
              type="text"
              placeholder={t.guestNamePlaceholder}
              value={guestName}
              onChange={(e) =>
                // Letters and spaces only. The Azerbaijani "ə" sits outside the
                // À-ÿ range, so it must be listed explicitly — without it
                // "Rəhimov" was silently saved as "Rhimov".
                setGuestName(
                  e.target.value.replace(/[^a-zA-ZÀ-ÿəƏğüşıöçĞÜŞİÖÇI\s'-]/g, ''),
                )
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#006653]/30 focus:border-[#006653]"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
              <Phone className="h-3.5 w-3.5" /> {t.phoneLabel}
            </label>
            <input
              type="tel"
              placeholder={t.phonePlaceholder}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#006653]/30 focus:border-[#006653]"
            />
          </div>

          {reservationError && (
            <p className="text-red-500 text-xs">{reservationError}</p>
          )}

          <button
            onClick={handleReservation}
            disabled={
              reserving || !guestName.trim() || !phone.trim() || !guestDraft
            }
            className="w-full py-3 bg-[#9fe870] hover:bg-[#8fdc5c] disabled:opacity-50 disabled:cursor-not-allowed text-[#14532d] font-semibold rounded-lg transition-colors">
            {reserving ? t.booking : t.bookTable}
          </button>
        </div>
      )}
    </>
  );
}
