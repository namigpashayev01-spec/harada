'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  DollarSign,
  Star,
  Home,
  X,
  Upload,
  Calendar,
  Navigation2,
  Users,
  Phone,
  CheckCircle2,
  Images,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { az as azLocale, enUS, ru as ruLocale } from 'date-fns/locale';
import 'react-day-picker/style.css';
import { Restaurant } from '@/types/restaurant';
import GoogleMap, { MapLocation } from '@/components/Places/GoogleMap';
import reservationService from '@/services/reservation.service';
import feedbackService, { Impression } from '@/services/feedback.service';
import FeedbackList from './FeedbackList';
import OpeningHours from './OpeningHours';
import FavoriteButton from '@/components/common/FavoriteButton';
import { useAuth } from '@/context/AuthContext';

interface RestaurantDetailProps {
  restaurant: Restaurant;
  lang: string;
}

const ratingEmojis: Record<number, string> = {
  1: '😢',
  2: '😕',
  3: '😐',
  4: '😊',
  5: '😍',
};

interface Dict {
  places: string;
  giveFeedback: string;
  reviewsCount: (n: number) => string;
  openFrom: (v: string) => string;
  averagePriceInline: (p: string) => string;
  photos: (n: number) => string;
  noImage: string;
  specialOffer: string;
  features: string;
  menu: string;
  location: string;
  reserveTable: string;
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
  reservationError: string;
  booking: string;
  bookTable: string;
  quickInfo: string;
  averagePriceLabel: (p: string) => string;
  distanceTo: (title: string) => string;
  vipRestaurant: string;
  ratingFeedback: string;
  name: string;
  surname: string;
  nameFromAccount: string;
  recommend: string;
  whatImpressed: string;
  uploadImages: string;
  writeFeedback: string;
  writeHere: string;
  submitting: string;
  submitFeedback: string;
  nameRequired: string;
  ratingLabels: Record<number, string>;
}

const DICT: Record<string, Dict> = {
  az: {
    places: 'Məkanlar',
    giveFeedback: 'Rəy bildir',
    reviewsCount: (n) => `${n} rəy`,
    openFrom: (v) => `${v}-dan açıqdır`,
    averagePriceInline: (p) => `Orta hesab ${p} AZN`,
    photos: (n) => `${n} şəkil`,
    noImage: 'Şəkil yoxdur',
    specialOffer: 'Xüsusi təklif',
    features: 'İmkanlar',
    menu: 'Menyu',
    location: 'Yerləşmə',
    reserveTable: 'Masa rezerv et',
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
    reservationError: 'Rezervasiya tamamlanmadı. Yenidən cəhd edin.',
    booking: 'Rezerv olunur…',
    bookTable: 'Masa rezerv et',
    quickInfo: 'Qısa məlumat',
    averagePriceLabel: (p) => `Orta hesab: ${p} AZN`,
    distanceTo: (title) => ` ${title} məkanına qədər`,
    vipRestaurant: 'VIP restoran',
    ratingFeedback: 'Qiymətləndirmə və rəy',
    name: 'Ad',
    surname: 'Soyad',
    nameFromAccount: 'Ad hesabınızdan götürülüb.',
    recommend: 'Bu restoranı dostlarıma tövsiyə edirəm',
    whatImpressed: 'Nə xoşunuza gəldi?',
    uploadImages: 'Şəkil yüklə',
    writeFeedback: 'Rəyinizi yazın',
    writeHere: 'Buraya yazın...',
    submitting: 'Göndərilir...',
    submitFeedback: 'Rəyi göndər',
    nameRequired: 'Ad və Soyad mütləqdir.',
    ratingLabels: {
      1: 'Təcrübəm pis idi',
      2: 'Təcrübəm orta idi',
      3: 'Təcrübəm normal idi',
      4: 'Təcrübəm yaxşı idi',
      5: 'Təcrübəm əla idi',
    },
  },
  en: {
    places: 'Places',
    giveFeedback: 'Write a review',
    reviewsCount: (n) => `${n} reviews`,
    openFrom: (v) => `Open from ${v}`,
    averagePriceInline: (p) => `${p} AZN average price`,
    photos: (n) => `${n} photos`,
    noImage: 'No image available',
    specialOffer: 'Special Offer',
    features: 'Features',
    menu: 'Menu',
    location: 'Location',
    reserveTable: 'Reserve a Table',
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
    reservationError: 'Could not complete reservation. Please try again.',
    booking: 'Booking…',
    bookTable: 'Book a Table',
    quickInfo: 'Quick Info',
    averagePriceLabel: (p) => `Average price: ${p} AZN`,
    distanceTo: (title) => ` from ${title} to your location`,
    vipRestaurant: 'VIP Restaurant',
    ratingFeedback: 'Rating & Feedback',
    name: 'Name',
    surname: 'Surname',
    nameFromAccount: 'Name is taken from your account.',
    recommend: 'I recommend this restaurant to my friends',
    whatImpressed: 'What impressed you?',
    uploadImages: 'Upload images',
    writeFeedback: 'Write your feedback',
    writeHere: 'Write here...',
    submitting: 'Submitting...',
    submitFeedback: 'Submit Feedback',
    nameRequired: 'Name and Surname are required.',
    ratingLabels: {
      1: 'My experience was bad',
      2: 'My experience was okay',
      3: 'My experience was fine',
      4: 'My experience was good',
      5: 'My experience was amazing',
    },
  },
  ru: {
    places: 'Места',
    giveFeedback: 'Оставить отзыв',
    reviewsCount: (n) => `${n} отзывов`,
    openFrom: (v) => `Открыто с ${v}`,
    averagePriceInline: (p) => `Средний чек ${p} AZN`,
    photos: (n) => `${n} фото`,
    noImage: 'Нет изображения',
    specialOffer: 'Спецпредложение',
    features: 'Услуги',
    menu: 'Меню',
    location: 'Расположение',
    reserveTable: 'Забронировать столик',
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
    reservationError: 'Не удалось забронировать. Попробуйте снова.',
    booking: 'Бронирование…',
    bookTable: 'Забронировать',
    quickInfo: 'Кратко',
    averagePriceLabel: (p) => `Средний чек: ${p} AZN`,
    distanceTo: (title) => ` от ${title} до вас`,
    vipRestaurant: 'VIP ресторан',
    ratingFeedback: 'Оценка и отзыв',
    name: 'Имя',
    surname: 'Фамилия',
    nameFromAccount: 'Имя взято из вашего аккаунта.',
    recommend: 'Рекомендую этот ресторан друзьям',
    whatImpressed: 'Что вам понравилось?',
    uploadImages: 'Загрузить фото',
    writeFeedback: 'Напишите отзыв',
    writeHere: 'Напишите здесь...',
    submitting: 'Отправка...',
    submitFeedback: 'Отправить отзыв',
    nameRequired: 'Имя и Фамилия обязательны.',
    ratingLabels: {
      1: 'Мне совсем не понравилось',
      2: 'Так себе',
      3: 'Нормально',
      4: 'Хорошо',
      5: 'Великолепно',
    },
  },
};

const DP_LOCALES: Record<string, typeof azLocale> = {
  az: azLocale,
  en: enUS,
  ru: ruLocale,
};

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function RestaurantDetail({
  restaurant,
  lang,
}: RestaurantDetailProps) {
  const { user } = useAuth();
  const t = DICT[lang] ?? DICT.az;
  const dpLocale = DP_LOCALES[lang] ?? azLocale;
  const allImages = [
    restaurant.image,
    ...restaurant.galleries.map((g) => g.image),
  ].filter(Boolean);
  const allMenuImages = restaurant.menus.flatMap((m) => m.images ?? []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(1);
  const [feedbackHover, setFeedbackHover] = useState(0);
  const [feedbackRecommend, setFeedbackRecommend] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackSurname, setFeedbackSurname] = useState('');
  const [selectedImpressionId, setSelectedImpressionId] = useState<
    number | null
  >(null);
  const [impressions, setImpressions] = useState<Impression[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [menuLightbox, setMenuLightbox] = useState<{
    images: string[];
    index: number;
  } | null>(null);
  const [feedbackRefreshKey, setFeedbackRefreshKey] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [mobileReserveOpen, setMobileReserveOpen] = useState(false);

  // Reservation state
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [reserving, setReserving] = useState(false);
  const [reservationDone, setReservationDone] = useState(false);
  const [reservationError, setReservationError] = useState('');

  const DAY_NAMES = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ] as const;
  const workingHours = restaurant.working_hours ?? [];
  const selectedDayName = selectedDate
    ? DAY_NAMES[selectedDate.getDay()]
    : null;
  const workingDay = workingHours.find((d) => d.day === selectedDayName);
  const currentMeal = workingDay?.meals.find((m) => m.type === selectedMeal);

  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const handleReservation = async () => {
    if (!selectedDate || !selectedTime || !guestName || !phone) return;
    setReserving(true);
    setReservationError('');
    try {
      await reservationService.create({
        restoran_id: restaurant.id,
        date: formatDate(selectedDate),
        time_slot: selectedMeal!,
        time: selectedTime,
        guest_count: guestCount,
        guest_names: guestName,
        phone,
      });
      setReservationDone(true);
    } catch {
      setReservationError(t.reservationError);
    } finally {
      setReserving(false);
    }
  };

  const openFeedback = () => {
    if (user) {
      const parts = (user.name ?? '').trim().split(/\s+/);
      setFeedbackName(parts[0] ?? '');
      setFeedbackSurname(parts.slice(1).join(' '));
    }
    setFeedbackOpen(true);
  };

  const resetReservation = () => {
    setReservationDone(false);
    setSelectedDate(undefined);
    setSelectedMeal(null);
    setSelectedTime(null);
    setGuestName('');
    setPhone('');
    setGuestCount(1);
  };

  useEffect(() => {
    if (!restaurant.latitude || !restaurant.longitude) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const km = haversineKm(
        pos.coords.latitude,
        pos.coords.longitude,
        parseFloat(restaurant.latitude),
        parseFloat(restaurant.longitude),
      );
      setDistance(km);
    });
  }, [restaurant.latitude, restaurant.longitude]);

  useEffect(() => {
    feedbackService.getImpressions().then((res) => setImpressions(res.data));
  }, []);

  // Lock body scroll while the mobile reservation sheet is open
  useEffect(() => {
    if (!mobileReserveOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileReserveOpen]);

  // Close the mobile reservation sheet automatically once a booking succeeds
  useEffect(() => {
    if (reservationDone) setMobileReserveOpen(false);
  }, [reservationDone]);

  // Keyboard navigation for the menu image lightbox (← → to scroll, Esc to close)
  useEffect(() => {
    if (!menuLightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setMenuLightbox(
          (prev) =>
            prev && {
              ...prev,
              index: (prev.index - 1 + prev.images.length) % prev.images.length,
            },
        );
      } else if (e.key === 'ArrowRight') {
        setMenuLightbox(
          (prev) =>
            prev && {
              ...prev,
              index: (prev.index + 1) % prev.images.length,
            },
        );
      } else if (e.key === 'Escape') {
        setMenuLightbox(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuLightbox]);

  const toggleImpression = (id: number) =>
    setSelectedImpressionId((prev) => (prev === id ? null : id));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      setUploadedFiles((prev) => [...prev, file]);
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result)
          setUploadedImages((prev) => [...prev, ev.target!.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFeedbackSubmit = async () => {
    setFeedbackSubmitting(true);
    try {
      await feedbackService.create({
        restoran_id: restaurant.id,
        rate: feedbackRating,
        recommed_friends: feedbackRecommend ? 1 : 0,
        impression_id: selectedImpressionId,
        galleries: uploadedFiles,
        name: feedbackName,
        surname: feedbackSurname,
        comment: feedbackText,
      });
      setFeedbackOpen(false);
      setFeedbackRefreshKey((k) => k + 1);
      setFeedbackRating(1);
      setFeedbackRecommend(false);
      setFeedbackText('');
      setFeedbackName('');
      setFeedbackSurname('');
      setSelectedImpressionId(null);
      setUploadedImages([]);
      setUploadedFiles([]);
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const mapLocation: MapLocation[] =
    restaurant.latitude && restaurant.longitude
      ? [
          {
            id: String(restaurant.id),
            title: restaurant.title,
            lat: parseFloat(restaurant.latitude),
            lng: parseFloat(restaurant.longitude),
            slug:
              restaurant.slug.az ||
              restaurant.slug.en ||
              restaurant.slug.ru ||
              String(restaurant.id),
            lang,
          },
        ]
      : [];

  const restaurantLocation =
    restaurant.latitude && restaurant.longitude
      ? {
          lat: parseFloat(restaurant.latitude),
          lng: parseFloat(restaurant.longitude),
        }
      : null;

  // Reservation flow body — shared between the desktop sticky card and the
  // mobile bottom sheet so both stay perfectly in sync.
  const renderReservationBody = () =>
    reservationDone ? (
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
    ) : (
      <>
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
            <div className="grid grid-cols-3 gap-2">
              {currentMeal.hours.map((h) => (
                <button
                  key={h}
                  onClick={() => setSelectedTime(h)}
                  className={`py-2 text-sm font-medium rounded-lg border transition-colors ${
                    selectedTime === h
                      ? 'bg-[#006653] text-white border-[#006653]'
                      : 'border-gray-200 text-gray-600 hover:border-[#006653] hover:text-[#006653]'
                  }`}>
                  {h}
                </button>
              ))}
            </div>
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
              <input
                type="number"
                min={1}
                max={50}
                value={guestCount}
                onChange={(e) =>
                  setGuestCount(Math.max(1, Number(e.target.value)))
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
                  setGuestName(
                    e.target.value.replace(/[^a-zA-ZÀ-ÿğüşıöçĞÜŞİÖÇ\s]/g, ''),
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
              disabled={reserving || !guestName.trim() || !phone.trim()}
              className="w-full py-3 bg-[#9fe870] hover:bg-[#8fdc5c] disabled:opacity-50 disabled:cursor-not-allowed text-[#14532d] font-semibold rounded-lg transition-colors">
              {reserving ? t.booking : t.bookTable}
            </button>
          </div>
        )}
      </>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href={`/${lang}`}>
              <Home className="h-4 w-4 hover:text-[#006653]" />
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={`/${lang}/places`}
              className="hover:text-[#006653] transition-colors">
              {t.places}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium truncate max-w-[200px]">
              {restaurant.title}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 pb-28 lg:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Image gallery */}
            <div className="space-y-2.5">
              <div className="relative h-[300px] sm:h-[440px] rounded-2xl overflow-hidden bg-gray-100 group shadow-sm">
                {allImages.length > 0 ? (
                  <Image
                    src={allImages[currentImageIndex]}
                    alt={restaurant.title || 'Restaurant'}
                    fill
                    className="object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-[1.02]"
                    onClick={() => setGalleryOpen(true)}
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">{t.noImage}</span>
                  </div>
                )}

                {/* Favorite (wishlist) — top-right overlay */}
                <div className="absolute top-4 right-4 z-10">
                  <FavoriteButton
                    restaurantId={restaurant.id}
                    variant="detail"
                    size={20}
                  />
                </div>

                {/* Subtle bottom gradient for legibility */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

                {allImages.length > 1 && (
                  <>
                    <button
                      aria-label="Previous photo"
                      onClick={() =>
                        setCurrentImageIndex((p) =>
                          p > 0 ? p - 1 : allImages.length - 1,
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white hover:scale-105 transition-all">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      aria-label="Next photo"
                      onClick={() =>
                        setCurrentImageIndex((p) =>
                          p < allImages.length - 1 ? p + 1 : 0,
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white hover:scale-105 transition-all">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* View all photos */}
                {allImages.length > 0 && (
                  <button
                    onClick={() => setGalleryOpen(true)}
                    className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/95 backdrop-blur text-gray-800 text-sm font-medium px-3.5 py-2 rounded-full shadow-lg hover:bg-white transition-colors">
                    <Images className="h-4 w-4" />
                    {t.photos(allImages.length)}
                  </button>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {restaurant.is_vip && (
                    <span className="bg-[#006653] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                      VIP
                    </span>
                  )}
                  {restaurant.is_special_offer && (
                    <span className="bg-[#9fe870] text-[#14532d] text-xs font-bold px-3 py-1 rounded-full shadow">
                      {t.specialOffer}
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail strip */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        idx === currentImageIndex
                          ? 'border-[#006653] ring-2 ring-[#006653]/20'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}>
                      <Image
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Restaurant info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {restaurant.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                  {typeof restaurant.rating === 'number' &&
                    restaurant.rating > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="flex items-center gap-1 bg-[#006653] text-white text-sm font-bold px-2.5 py-1 rounded-lg">
                          <Star className="h-3.5 w-3.5 fill-white" />
                          {restaurant.rating.toFixed(1)}
                        </span>
                        {restaurant.reviews_count != null && (
                          <span className="text-sm text-gray-500">
                            {t.reviewsCount(restaurant.reviews_count)}
                          </span>
                        )}
                      </div>
                    )}
                  {restaurant.district && (
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      {restaurant.district}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 mb-4 pt-4 border-t border-gray-100">
                {(workingHours.length > 0 || restaurant.open_from) && (
                  <OpeningHours
                    workingHours={workingHours}
                    openFrom={restaurant.open_from}
                    lang={lang}
                    variant="card"
                  />
                )}
                {restaurant.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    {restaurant.map_link ? (
                      <a
                        href={restaurant.map_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#006653] underline underline-offset-2 transition-colors">
                        {restaurant.address}
                      </a>
                    ) : (
                      <span>{restaurant.address}</span>
                    )}
                  </div>
                )}
                {restaurant.average_price && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <span>{t.averagePriceInline(restaurant.average_price)}</span>
                  </div>
                )}
              </div>

              {/* Categories */}
              {restaurant.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {restaurant.categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                      {cat.icon && (
                        <Image
                          src={cat.icon}
                          alt={cat.title || 'Category'}
                          width={14}
                          height={14}
                          className="w-3.5 h-3.5 object-contain"
                        />
                      )}
                      {cat.title}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              {restaurant.description && (
                <div
                  className="text-gray-700 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: restaurant.description }}
                />
              )}
            </div>

            {/* Properties */}
            {restaurant.properties.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eefae1]">
                    <Sparkles className="h-5 w-5 text-[#006653]" />
                  </span>
                  <h2 className="text-xl font-bold text-gray-900">
                    {t.features}
                  </h2>
                </div>
                <div className="space-y-4">
                  {restaurant.properties.map((prop) => (
                    <div key={prop.id}>
                      <div className="flex items-center gap-2 mb-2">
                        {prop.icon && !prop.icon.endsWith('/storage') && (
                          <Image
                            src={prop.icon}
                            alt={prop.title || 'Property'}
                            width={18}
                            height={18}
                            className="w-4.5 h-4.5 object-contain"
                          />
                        )}
                        <span className="font-semibold text-gray-800">
                          {prop.title}
                        </span>
                      </div>
                      {prop.sub_properties.length > 0 && (
                        <div className="flex flex-wrap gap-2 ml-6">
                          {prop.sub_properties.map((sub) => (
                            <span
                              key={sub.id}
                              className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                              {sub.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Structured menu (categories -> dishes + price) */}
            {restaurant.menu_categories &&
              restaurant.menu_categories.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2.5 mb-5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eefae1]">
                      <UtensilsCrossed className="h-5 w-5 text-[#006653]" />
                    </span>
                    <h2 className="text-xl font-bold text-gray-900">{t.menu}</h2>
                  </div>
                  <div className="space-y-6">
                    {restaurant.menu_categories.map((category) => (
                      <div key={category.id}>
                        <h3 className="text-base font-semibold text-[#006653] mb-2.5">
                          {category.name}
                        </h3>
                        <ul className="divide-y divide-gray-100">
                          {category.dishes.map((dish) => (
                            <li
                              key={dish.id}
                              className="flex items-start justify-between gap-4 py-2">
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

            {/* Menu */}
            {restaurant.menus.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eefae1]">
                    <UtensilsCrossed className="h-5 w-5 text-[#006653]" />
                  </span>
                  <h2 className="text-xl font-bold text-gray-900">{t.menu}</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(() => {
                    let imgOffset = 0;
                    return restaurant.menus.map((menu) => {
                      const hasImage = menu.images && menu.images.length > 0;
                      const startIndex = imgOffset;
                      imgOffset += menu.images?.length ?? 0;
                      return (
                        <div
                          key={menu.id}
                          onClick={() =>
                            hasImage &&
                            setMenuLightbox({
                              images: allMenuImages,
                              index: startIndex,
                            })
                          }
                          className={`rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 ${hasImage ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}>
                          {hasImage ? (
                            <div className="relative aspect-[4/3] w-full">
                              <Image
                                src={menu.images[0]}
                                alt={menu.title || 'Menu'}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="aspect-[4/3] w-full flex items-center justify-center bg-gray-100">
                              <Star className="h-8 w-8 text-gray-300" />
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* Menu image lightbox */}
            {menuLightbox && (
              <div
                className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 !m-0"
                onClick={() => setMenuLightbox(null)}>
                <div
                  className="relative max-w-2xl w-full"
                  onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setMenuLightbox(null)}
                    aria-label="Close"
                    className="absolute -top-10 right-0 text-white hover:text-gray-300">
                    <X className="h-7 w-7" />
                  </button>
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden">
                    <Image
                      src={menuLightbox.images[menuLightbox.index]}
                      alt=""
                      fill
                      className="object-contain"
                    />

                    {menuLightbox.images.length > 1 && (
                      <>
                        <button
                          aria-label="Previous image"
                          onClick={() =>
                            setMenuLightbox(
                              (prev) =>
                                prev && {
                                  ...prev,
                                  index:
                                    (prev.index - 1 + prev.images.length) %
                                    prev.images.length,
                                },
                            )
                          }
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2.5 transition-colors">
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                          aria-label="Next image"
                          onClick={() =>
                            setMenuLightbox(
                              (prev) =>
                                prev && {
                                  ...prev,
                                  index: (prev.index + 1) % prev.images.length,
                                },
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2.5 transition-colors">
                          <ChevronRight className="h-6 w-6" />
                        </button>
                        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                          {menuLightbox.index + 1} / {menuLightbox.images.length}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Fullscreen gallery lightbox */}
            {galleryOpen && allImages.length > 0 && (
              <div
                className="fixed inset-0 z-[100] bg-black/90 flex flex-col !m-0"
                onClick={() => setGalleryOpen(false)}>
                <div className="flex items-center justify-between px-5 py-4 text-white">
                  <span className="text-sm font-medium">
                    {currentImageIndex + 1} / {allImages.length}
                  </span>
                  <button
                    onClick={() => setGalleryOpen(false)}
                    aria-label="Close gallery"
                    className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div
                  className="flex-1 relative flex items-center justify-center px-4 pb-4"
                  onClick={(e) => e.stopPropagation()}>
                  <Image
                    src={allImages[currentImageIndex]}
                    alt={restaurant.title || 'Restaurant'}
                    fill
                    className="object-contain"
                  />
                  {allImages.length > 1 && (
                    <>
                      <button
                        aria-label="Previous photo"
                        onClick={() =>
                          setCurrentImageIndex((p) =>
                            p > 0 ? p - 1 : allImages.length - 1,
                          )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white rounded-full p-3 transition-colors">
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        aria-label="Next photo"
                        onClick={() =>
                          setCurrentImageIndex((p) =>
                            p < allImages.length - 1 ? p + 1 : 0,
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white rounded-full p-3 transition-colors">
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}
                </div>

                {allImages.length > 1 && (
                  <div
                    className="flex gap-2 overflow-x-auto px-5 pb-5 justify-center"
                    onClick={(e) => e.stopPropagation()}>
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative flex-shrink-0 w-16 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === currentImageIndex
                            ? 'border-white'
                            : 'border-transparent opacity-50 hover:opacity-100'
                        }`}>
                        <Image
                          src={img}
                          alt={`Gallery ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Map */}
            {restaurantLocation && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eefae1]">
                    <MapPin className="h-5 w-5 text-[#006653]" />
                  </span>
                  <h2 className="text-xl font-bold text-gray-900">
                    {t.location}
                  </h2>
                </div>
                <div className="h-[300px] rounded-lg overflow-hidden">
                  <GoogleMap
                    locations={mapLocation}
                    userLocation={restaurantLocation}
                    preview
                    externalLink={
                      restaurant.map_link ||
                      `https://www.google.com/maps?q=${restaurant.latitude},${restaurant.longitude}`
                    }
                  />
                </div>
              </div>
            )}

            {/* Reviews */}
            <FeedbackList
              slug={
                restaurant.slug[lang as keyof typeof restaurant.slug] ||
                restaurant.slug.az ||
                restaurant.slug.en ||
                restaurant.slug.ru ||
                String(restaurant.id)
              }
              refreshKey={feedbackRefreshKey}
              lang={lang}
              onWriteReview={openFeedback}
            />
          </div>

          {/* Right sidebar */}
          <div className="space-y-6 lg:sticky lg:top-6 self-start">
            {/* Reservation card — desktop sticky sidebar */}
            <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-gray-100 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#006653]" />
                <h3 className="font-semibold text-gray-900 text-lg">
                  {t.reserveTable}
                </h3>
              </div>
              {renderReservationBody()}
            </div>

            {/* Quick info card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                {t.quickInfo}
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                {(workingHours.length > 0 || restaurant.open_from) && (
                  <OpeningHours
                    workingHours={workingHours}
                    openFrom={restaurant.open_from}
                    lang={lang}
                    variant="sidebar"
                  />
                )}
                {restaurant.address && (
                  <div className="flex gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    {restaurant.map_link ? (
                      <a
                        href={restaurant.map_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#006653] underline underline-offset-2 transition-colors">
                        {restaurant.address}
                      </a>
                    ) : (
                      <span>{restaurant.address}</span>
                    )}
                  </div>
                )}
                {restaurant.average_price && (
                  <div className="flex gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>{t.averagePriceLabel(restaurant.average_price)}</span>
                  </div>
                )}
                {restaurant.categories.length > 0 && (
                  <div className="flex gap-2">
                    <Star className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>
                      {restaurant.categories.map((c) => c.title).join(', ')}
                    </span>
                  </div>
                )}
              </div>

              {distance !== null && (
                <div className="flex gap-2 items-start mt-2">
                  <Navigation2 className="h-4 w-4 text-[#006653] flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <span className="font-semibold text-[#006653]">
                      {distance < 1
                        ? `${Math.round(distance * 1000)} m`
                        : `${distance.toFixed(1)} km`}
                    </span>
                    <span className="text-gray-600">
                      {t.distanceTo(restaurant.title)}
                    </span>
                  </div>
                </div>
              )}

              {restaurant.is_vip && (
                <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-700 font-medium">
                  ⭐ {t.vipRestaurant}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky reservation bar — always in view on small screens */}
      <div className="lg:hidden fixed left-0 right-0 bottom-[60px] md:bottom-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:pb-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {restaurant.title}
            </p>
            {restaurant.average_price && (
              <p className="text-xs text-gray-500 truncate">
                {t.averagePriceLabel(restaurant.average_price)}
              </p>
            )}
          </div>
          <button
            onClick={() => setMobileReserveOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-[#9fe870] hover:bg-[#8fdc5c] text-[#14532d] font-semibold rounded-xl transition-colors whitespace-nowrap">
            <Calendar className="h-5 w-5" />
            {t.reserveTable}
          </button>
        </div>
      </div>

      {/* Mobile reservation bottom sheet */}
      {mobileReserveOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[60] flex items-end justify-center bg-black/50"
          onClick={() => setMobileReserveOpen(false)}>
          <div
            className="bg-white w-full max-w-lg rounded-t-2xl max-h-[88vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 bg-white flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#006653]" />
                <h3 className="font-semibold text-gray-900 text-lg">
                  {t.reserveTable}
                </h3>
              </div>
              <button
                onClick={() => setMobileReserveOpen(false)}
                aria-label="Close"
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            {renderReservationBody()}
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {t.ratingFeedback}
              </h2>
              <button
                onClick={() => setFeedbackOpen(false)}
                className="p-1 rounded-full border border-red-400 text-red-400 hover:bg-red-50 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Name / Surname — top, required */}
              <div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {t.name} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={feedbackName}
                      onChange={(e) => !user && setFeedbackName(e.target.value)}
                      readOnly={!!user}
                      placeholder={t.name}
                      className={`w-full border rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        user ? 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {t.surname} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={feedbackSurname}
                      onChange={(e) => !user && setFeedbackSurname(e.target.value)}
                      readOnly={!!user}
                      placeholder={t.surname}
                      className={`w-full border rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        user ? 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed' : 'border-gray-200'
                      }`}
                    />
                  </div>
                </div>
                {user && (
                  <p className="text-xs text-gray-400 mt-1">{t.nameFromAccount}</p>
                )}
              </div>

              {/* Rating */}
              <div>
                <p className="text-sm text-gray-700 mb-3">
                  {t.ratingLabels[feedbackHover || feedbackRating]}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setFeedbackHover(star)}
                        onMouseLeave={() => setFeedbackHover(0)}
                        onClick={() => setFeedbackRating(star)}>
                        <Star
                          className={`h-9 w-9 transition-colors ${
                            star <= (feedbackHover || feedbackRating)
                              ? 'fill-orange-400 text-orange-400'
                              : 'fill-orange-100 text-orange-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-3xl">
                    {ratingEmojis[feedbackHover || feedbackRating]}
                  </span>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={feedbackRecommend}
                  onChange={(e) => setFeedbackRecommend(e.target.checked)}
                  className="w-4 h-4 accent-teal-700 rounded"
                />
                <span className="text-sm text-gray-700">
                  {t.recommend}
                </span>
              </label>

              <div>
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  {t.whatImpressed}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {impressions?.map((impression) => (
                    <button
                      key={impression.id}
                      onClick={() => toggleImpression(impression.id)}
                      className={`py-2 px-3 text-sm rounded-lg border transition-colors ${
                        selectedImpressionId === impression.id
                          ? 'border-teal-600 bg-teal-50 text-teal-700 font-medium'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}>
                      {impression.title}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex gap-3 flex-wrap">
                  <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-gray-400 transition-colors text-gray-500 cursor-pointer">
                    <Upload className="h-5 w-5" />
                    <span className="text-xs">{t.uploadImages}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                  {uploadedImages.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative w-24 h-24 rounded-lg overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() =>
                          setUploadedImages((prev) =>
                            prev.filter((_, i) => i !== idx),
                          )
                        }
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  {t.writeFeedback}
                </p>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder={t.writeHere}
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                onClick={handleFeedbackSubmit}
                disabled={feedbackSubmitting || !feedbackName.trim() || !feedbackSurname.trim()}
                className="w-full py-3 bg-[#006653] hover:bg-[#00543f] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors">
                {feedbackSubmitting ? t.submitting : t.submitFeedback}
              </button>
              {(!feedbackName.trim() || !feedbackSurname.trim()) && (
                <p className="text-xs text-red-500 text-center -mt-3">{t.nameRequired}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
