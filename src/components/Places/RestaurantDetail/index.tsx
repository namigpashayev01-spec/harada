'use client';

import { homeLang } from '@/lib/locales';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
  Home,
  X,
  Upload,
  Calendar,
  Navigation2,
  Images,
  Sparkles,
  UtensilsCrossed,
  Phone,
  Globe,
} from 'lucide-react';
import { Restaurant } from '@/types/restaurant';
import GoogleMap, { MapLocation } from '@/components/Places/GoogleMap';
import ReservationForm from '@/components/Places/ReservationForm';
import feedbackService, { Impression } from '@/services/feedback.service';
import { countryPath } from '@/lib/geo';
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
  viewMenu: string;
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
  whatImpressedHint: string;
  uploadImages: string;
  writeFeedback: string;
  writeHere: string;
  submitting: string;
  submitFeedback: string;
  nameRequired: string;
  impressionRequired: string;
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
    viewMenu: 'Menyuya bax',
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
    whatImpressedHint: 'Bir neçəsini seçə bilərsiniz',
    uploadImages: 'Şəkil yüklə',
    writeFeedback: 'Rəyinizi yazın',
    writeHere: 'Buraya yazın...',
    submitting: 'Göndərilir...',
    submitFeedback: 'Rəyi göndər',
    nameRequired: 'Ad və Soyad mütləqdir.',
    impressionRequired: 'Ən azı bir seçim edin.',
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
    viewMenu: 'View Menu',
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
    whatImpressedHint: 'You can pick more than one',
    uploadImages: 'Upload images',
    writeFeedback: 'Write your feedback',
    writeHere: 'Write here...',
    submitting: 'Submitting...',
    submitFeedback: 'Submit Feedback',
    nameRequired: 'Name and Surname are required.',
    impressionRequired: 'Pick at least one option.',
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
    viewMenu: 'Смотреть меню',
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
    whatImpressedHint: 'Можно выбрать несколько',
    uploadImages: 'Загрузить фото',
    writeFeedback: 'Напишите отзыв',
    writeHere: 'Напишите здесь...',
    submitting: 'Отправка...',
    submitFeedback: 'Отправить отзыв',
    nameRequired: 'Имя и Фамилия обязательны.',
    impressionRequired: 'Выберите хотя бы один вариант.',
    ratingLabels: {
      1: 'Мне совсем не понравилось',
      2: 'Так себе',
      3: 'Нормально',
      4: 'Хорошо',
      5: 'Великолепно',
    },
  },
};

// Foreign-section languages (src/lib/locales.ts). Reservations are not offered
// abroad, so booking strings stay English; what a visitor reads is translated.
DICT.sr = {
  ...DICT.en,
  places: 'Mesta',
  giveFeedback: 'Ostavi recenziju',
  reviewsCount: (n) => `${n} recenzija`,
  openFrom: (v) => `Otvoreno od ${v}`,
  photos: (n) => `${n} fotografija`,
  noImage: 'Nema fotografije',
  specialOffer: 'Posebna ponuda',
  features: 'Karakteristike',
  menu: 'Meni',
  viewMenu: 'Pogledaj meni',
  location: 'Lokacija',
  quickInfo: 'Ukratko',
  distanceTo: (title) => ` od ${title} do vas`,
  ratingFeedback: 'Ocena i recenzija',
  name: 'Ime',
  surname: 'Prezime',
  recommend: 'Preporučujem ovaj restoran prijateljima',
  whatImpressed: 'Šta vam se dopalo?',
  whatImpressedHint: 'Možete izabrati više opcija',
  uploadImages: 'Dodaj fotografije',
  writeFeedback: 'Napišite recenziju',
  writeHere: 'Pišite ovde...',
  submitting: 'Šalje se...',
  submitFeedback: 'Pošalji recenziju',
  nameRequired: 'Ime i prezime su obavezni.',
  impressionRequired: 'Izaberite bar jednu opciju.',
  ratingLabels: { 1: 'Loše iskustvo', 2: 'Osrednje iskustvo', 3: 'Solidno iskustvo', 4: 'Dobro iskustvo', 5: 'Odlično iskustvo' },
};
DICT.nl = {
  ...DICT.en,
  places: 'Plekken',
  giveFeedback: 'Beoordeling schrijven',
  reviewsCount: (n) => `${n} beoordelingen`,
  openFrom: (v) => `Open vanaf ${v}`,
  photos: (n) => `${n} foto's`,
  noImage: 'Geen foto',
  specialOffer: 'Speciale aanbieding',
  features: 'Kenmerken',
  menu: 'Menu',
  viewMenu: 'Menu bekijken',
  location: 'Locatie',
  quickInfo: 'In het kort',
  distanceTo: (title) => ` van ${title} naar jouw locatie`,
  ratingFeedback: 'Beoordeling',
  name: 'Voornaam',
  surname: 'Achternaam',
  recommend: 'Ik raad dit restaurant aan vrienden aan',
  whatImpressed: 'Wat viel je op?',
  whatImpressedHint: 'Je kunt meerdere kiezen',
  uploadImages: "Foto's uploaden",
  writeFeedback: 'Schrijf je beoordeling',
  writeHere: 'Schrijf hier...',
  submitting: 'Verzenden...',
  submitFeedback: 'Beoordeling verzenden',
  nameRequired: 'Voor- en achternaam zijn verplicht.',
  impressionRequired: 'Kies minstens één optie.',
  ratingLabels: { 1: 'Slechte ervaring', 2: 'Matige ervaring', 3: 'Prima ervaring', 4: 'Goede ervaring', 5: 'Geweldige ervaring' },
};
DICT.uz = {
  ...DICT.en,
  places: 'Maskanlar',
  giveFeedback: 'Sharh qoldirish',
  reviewsCount: (n) => `${n} ta sharh`,
  openFrom: (v) => `${v} dan ochiq`,
  photos: (n) => `${n} ta rasm`,
  noImage: "Rasm yo'q",
  specialOffer: 'Maxsus taklif',
  features: 'Imkoniyatlar',
  menu: 'Menyu',
  viewMenu: "Menyuni ko'rish",
  location: 'Joylashuv',
  quickInfo: "Qisqacha ma'lumot",
  distanceTo: (title) => ` ${title} gacha masofa`,
  ratingFeedback: 'Baho va sharh',
  name: 'Ism',
  surname: 'Familiya',
  recommend: "Bu restoranni do'stlarimga tavsiya qilaman",
  whatImpressed: 'Sizga nima yoqdi?',
  whatImpressedHint: 'Bir nechtasini tanlashingiz mumkin',
  uploadImages: 'Rasm yuklash',
  writeFeedback: 'Sharhingizni yozing',
  writeHere: 'Shu yerga yozing...',
  submitting: 'Yuborilmoqda...',
  submitFeedback: 'Sharhni yuborish',
  nameRequired: 'Ism va familiya majburiy.',
  impressionRequired: 'Kamida bittasini tanlang.',
  ratingLabels: { 1: 'Yomon', 2: "O'rtacha", 3: 'Yaxshi emas, yomon ham emas', 4: 'Yaxshi', 5: "A'lo" },
};
DICT.fr = {
  ...DICT.en,
  places: 'Lieux',
  giveFeedback: 'Laisser un avis',
  reviewsCount: (n) => `${n} avis`,
  openFrom: (v) => `Ouvert dès ${v}`,
  photos: (n) => `${n} photos`,
  noImage: 'Aucune photo',
  specialOffer: 'Offre spéciale',
  features: 'Caractéristiques',
  menu: 'Menu',
  viewMenu: 'Voir le menu',
  location: 'Emplacement',
  quickInfo: 'En bref',
  distanceTo: (title) => ` de ${title} à votre position`,
  ratingFeedback: 'Note et avis',
  name: 'Prénom',
  surname: 'Nom',
  recommend: 'Je recommande ce restaurant à mes amis',
  whatImpressed: 'Qu’avez-vous apprécié ?',
  whatImpressedHint: 'Plusieurs choix possibles',
  uploadImages: 'Ajouter des photos',
  writeFeedback: 'Rédigez votre avis',
  writeHere: 'Écrivez ici...',
  submitting: 'Envoi...',
  submitFeedback: 'Envoyer l’avis',
  nameRequired: 'Le prénom et le nom sont obligatoires.',
  impressionRequired: 'Choisissez au moins une option.',
  ratingLabels: { 1: 'Mauvaise expérience', 2: 'Expérience moyenne', 3: 'Expérience correcte', 4: 'Bonne expérience', 5: 'Excellente expérience' },
};
DICT.lv = {
  ...DICT.en,
  places: 'Vietas',
  giveFeedback: 'Atstāt atsauksmi',
  reviewsCount: (n) => `${n} atsauksmes`,
  openFrom: (v) => `Atvērts no ${v}`,
  photos: (n) => `${n} foto`,
  noImage: 'Nav attēla',
  specialOffer: 'Īpašais piedāvājums',
  features: 'Iespējas',
  menu: 'Ēdienkarte',
  viewMenu: 'Skatīt ēdienkarti',
  location: 'Atrašanās vieta',
  quickInfo: 'Īsumā',
  distanceTo: (title) => ` no ${title} līdz jums`,
  ratingFeedback: 'Vērtējums un atsauksme',
  name: 'Vārds',
  surname: 'Uzvārds',
  recommend: 'Iesaku šo restorānu draugiem',
  whatImpressed: 'Kas jums patika?',
  whatImpressedHint: 'Varat izvēlēties vairākus',
  uploadImages: 'Augšupielādēt foto',
  writeFeedback: 'Uzrakstiet atsauksmi',
  writeHere: 'Rakstiet šeit...',
  submitting: 'Sūta...',
  submitFeedback: 'Nosūtīt atsauksmi',
  nameRequired: 'Vārds un uzvārds ir obligāti.',
  impressionRequired: 'Izvēlieties vismaz vienu variantu.',
  ratingLabels: { 1: 'Slikta pieredze', 2: 'Viduvēja pieredze', 3: 'Normāla pieredze', 4: 'Laba pieredze', 5: 'Lieliska pieredze' },
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
  const t = DICT[lang] ?? DICT.en;
  const allImages = [
    restaurant.image,
    ...restaurant.galleries.map((g) => g.image),
  ].filter(Boolean);

  // Menu lives on its own page (/places/[slug]/menu). Only surface the button
  // when the restaurant actually has menu content to show.
  const menuSlug =
    restaurant.slug[lang as keyof typeof restaurant.slug] ||
    restaurant.slug.az ||
    restaurant.slug.en ||
    restaurant.slug.ru ||
    String(restaurant.id);
  const menuHref = `/${lang}/places/${menuSlug}/menu`;
  const hasMenu =
    (restaurant.menu_categories?.length ?? 0) > 0 ||
    restaurant.menus.some((m) => (m.images?.length ?? 0) > 0);

  // Reservations exist for Azerbaijani restaurants only. Restaurants from other
  // countries (Tashkent, Toronto) are listings of public facts with nobody on
  // our side to take a booking, so they get the phone number and website.
  const isHome = (restaurant.country ?? 'AZ') === 'AZ';
  const foreignCountryPath = isHome ? null : countryPath(lang, restaurant.country);
  const foreignCityPath =
    foreignCountryPath && restaurant.city ? `${foreignCountryPath}/${restaurant.city}` : null;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(1);
  const [feedbackHover, setFeedbackHover] = useState(0);
  const [feedbackRecommend, setFeedbackRecommend] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackSurname, setFeedbackSurname] = useState('');
  const [selectedImpressionIds, setSelectedImpressionIds] = useState<number[]>(
    [],
  );
  const [impressions, setImpressions] = useState<Impression[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [feedbackRefreshKey, setFeedbackRefreshKey] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [mobileReserveOpen, setMobileReserveOpen] = useState(false);

  // Reservation state now lives in <ReservationForm>, which is shared with the
  // menu page.
  const workingHours = restaurant.working_hours ?? [];

  const openFeedback = () => {
    if (user) {
      const parts = (user.name ?? '').trim().split(/\s+/);
      setFeedbackName(parts[0] ?? '');
      setFeedbackSurname(parts.slice(1).join(' '));
    }
    setFeedbackOpen(true);
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

  const toggleImpression = (id: number) =>
    setSelectedImpressionIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

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
        impression_ids: selectedImpressionIds,
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
      setSelectedImpressionIds([]);
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
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href={`/${homeLang(lang)}`}>
              <Home className="h-4 w-4 hover:text-[#006653]" />
            </Link>
            <ChevronRight className="h-4 w-4" />
            {foreignCountryPath ? (
              <>
                <Link
                  href={foreignCountryPath}
                  className="hover:text-[#006653] transition-colors">
                  {restaurant.country_name}
                </Link>
                {foreignCityPath && restaurant.city_name && (
                  <>
                    <ChevronRight className="h-4 w-4" />
                    <Link
                      href={foreignCityPath}
                      className="hover:text-[#006653] transition-colors">
                      {restaurant.city_name}
                    </Link>
                  </>
                )}
              </>
            ) : (
              <Link
                href={`/${homeLang(lang)}/places`}
                className="hover:text-[#006653] transition-colors">
                {t.places}
              </Link>
            )}
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

                {/* Google Places photos must carry their author's name. */}
                {currentImageIndex === 0 && restaurant.image && restaurant.image_credit && (
                  <span className="absolute bottom-2 left-2 z-10 max-w-[80%] truncate rounded bg-black/55 px-2 py-0.5 text-[11px] text-white/90 pointer-events-none">
                    © {restaurant.image_credit}
                  </span>
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

              {/* View menu — opens the restaurant's dedicated menu page */}
              {hasMenu && (
                <Link
                  href={menuHref}
                  aria-label={t.viewMenu}
                  className="mb-4 inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-3 bg-[#006653] hover:bg-[#00543f] text-white font-semibold rounded-xl shadow-sm transition-colors">
                  <UtensilsCrossed className="h-5 w-5" />
                  {t.viewMenu}
                </Link>
              )}

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
            {/* Reservation card — desktop sticky sidebar (home country only) */}
            {isHome && (
              <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-gray-100 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#006653]" />
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {t.reserveTable}
                  </h3>
                </div>
                <ReservationForm
                  restaurant={restaurant}
                  lang={lang}
                  onDone={() => setMobileReserveOpen(false)}
                />
              </div>
            )}

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
                {/* Abroad there is no booking form, so the contact facts are
                    the page's call to action. */}
                {!isHome && restaurant.phone && (
                  <div className="flex gap-2">
                    <Phone className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <a
                      href={`tel:${restaurant.phone.replace(/[^\d+]/g, '')}`}
                      className="hover:text-[#006653] underline underline-offset-2 transition-colors">
                      {restaurant.phone}
                    </a>
                  </div>
                )}
                {!isHome && restaurant.website && (
                  <div className="flex gap-2 min-w-0">
                    <Globe className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <a
                      href={restaurant.website}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="truncate hover:text-[#006653] underline underline-offset-2 transition-colors">
                      {restaurant.website.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '')}
                    </a>
                  </div>
                )}
                {/* OpenStreetMap data is ODbL: the page that shows it must credit it. */}
                {restaurant.source === 'osm' && (
                  <a
                    href="https://www.openstreetmap.org/copyright"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="block text-xs text-gray-400 hover:text-[#006653] transition-colors">
                    © OpenStreetMap contributors
                  </a>
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
          </div>
          {hasMenu && (
            <Link
              href={menuHref}
              aria-label={t.viewMenu}
              className="flex items-center gap-2 px-4 py-3 border border-[#006653] text-[#006653] hover:bg-[#eefae1] font-semibold rounded-xl transition-colors whitespace-nowrap">
              <UtensilsCrossed className="h-5 w-5" />
              <span className="hidden sm:inline">{t.menu}</span>
            </Link>
          )}
          {isHome ? (
            <button
              onClick={() => setMobileReserveOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-[#9fe870] hover:bg-[#8fdc5c] text-[#14532d] font-semibold rounded-xl transition-colors whitespace-nowrap">
              <Calendar className="h-5 w-5" />
              {t.reserveTable}
            </button>
          ) : (
            restaurant.phone && (
              // No booking flow abroad — the one useful action is a call.
              <a
                href={`tel:${restaurant.phone.replace(/[^\d+]/g, '')}`}
                className="flex items-center gap-2 px-5 py-3 bg-[#9fe870] hover:bg-[#8fdc5c] text-[#14532d] font-semibold rounded-xl transition-colors whitespace-nowrap">
                <Phone className="h-5 w-5" />
                {restaurant.phone}
              </a>
            )
          )}
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
            <ReservationForm
                restaurant={restaurant}
                lang={lang}
                onDone={() => setMobileReserveOpen(false)}
              />
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
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {t.whatImpressed}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  {t.whatImpressedHint}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {impressions?.map((impression) => (
                    <button
                      key={impression.id}
                      type="button"
                      aria-pressed={selectedImpressionIds.includes(
                        impression.id,
                      )}
                      onClick={() => toggleImpression(impression.id)}
                      className={`flex items-center justify-center gap-1 py-2 px-3 text-sm rounded-lg border transition-colors ${
                        selectedImpressionIds.includes(impression.id)
                          ? 'border-teal-600 bg-teal-50 text-teal-700 font-medium'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}>
                      {selectedImpressionIds.includes(impression.id) && (
                        <Check className="h-3.5 w-3.5 shrink-0" />
                      )}
                      <span>{impression.title}</span>
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
                disabled={
                  feedbackSubmitting ||
                  !feedbackName.trim() ||
                  !feedbackSurname.trim() ||
                  selectedImpressionIds.length === 0
                }
                className="w-full py-3 bg-[#006653] hover:bg-[#00543f] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors">
                {feedbackSubmitting ? t.submitting : t.submitFeedback}
              </button>
              {(!feedbackName.trim() || !feedbackSurname.trim()) && (
                <p className="text-xs text-red-500 text-center -mt-3">{t.nameRequired}</p>
              )}
              {selectedImpressionIds.length === 0 && (
                <p className="text-xs text-red-500 text-center -mt-3">
                  {t.impressionRequired}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
