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
  Clock,
} from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { Restaurant } from '@/types/restaurant';
import GoogleMap, { MapLocation } from '@/components/Places/GoogleMap';
import reservationService from '@/services/reservation.service';
import feedbackService, { Impression } from '@/services/feedback.service';
import FeedbackList from './FeedbackList';
import FavoriteButton from '@/components/common/FavoriteButton';
import { useAuth } from '@/context/AuthContext';

interface RestaurantDetailProps {
  restaurant: Restaurant;
  lang: string;
}

const ratingLabels: Record<number, string> = {
  1: 'My experience was bad',
  2: 'My experience was okay',
  3: 'My experience was fine',
  4: 'My experience was good',
  5: 'My experience was amazing',
};
const ratingEmojis: Record<number, string> = {
  1: '😢',
  2: '😕',
  3: '😐',
  4: '😊',
  5: '😍',
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
  const allImages = [
    restaurant.image,
    ...restaurant.galleries.map((g) => g.image),
  ].filter(Boolean);

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
      setReservationError('Could not complete reservation. Please try again.');
    } finally {
      setReserving(false);
    }
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

  console.log('Res', restaurant);

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
              Places
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium truncate max-w-[200px]">
              {restaurant.title}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Image gallery */}
            <div className="relative bg-white rounded-lg overflow-hidden">
              <div className="relative h-[400px]">
                {allImages.length > 0 ? (
                  <Image
                    src={allImages[currentImageIndex]}
                    alt={restaurant.title || 'Restaurant'}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((p) =>
                          p > 0 ? p - 1 : allImages.length - 1,
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-colors">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((p) =>
                          p < allImages.length - 1 ? p + 1 : 0,
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-colors">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white text-sm px-2 py-1 rounded">
                      {currentImageIndex + 1} / {allImages.length}
                    </div>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {restaurant.is_vip && (
                    <span className="bg-[#006653] text-white text-xs font-bold px-3 py-1 rounded-full">
                      VIP
                    </span>
                  )}
                  {restaurant.is_special_offer && (
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Special Offer
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail strip */}
              {allImages.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        idx === currentImageIndex
                          ? 'border-[#006653]'
                          : 'border-transparent'
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
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {restaurant.title}
                </h1>
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <FavoriteButton
                    restaurantId={restaurant.id}
                    variant="detail"
                    size={20}
                  />
                  <button
                    onClick={() => {
                      if (user) {
                        const parts = (user.name ?? '').trim().split(/\s+/);
                        setFeedbackName(parts[0] ?? '');
                        setFeedbackSurname(parts.slice(1).join(' '));
                      }
                      setFeedbackOpen(true);
                    }}
                    className="px-4 py-2 bg-[#006653] hover:bg-[#00543f] text-white text-sm font-medium rounded-lg transition-colors">
                    Give Feedback
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 mb-4">
                {restaurant.open_from && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <span>Open from {restaurant.open_from}</span>
                  </div>
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
                    <span>{restaurant.average_price} AZN average price</span>
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
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Features
                </h2>
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

            {/* Menu */}
            {restaurant.menus.length > 0 && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Menu</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {restaurant.menus.map((menu) => {
                    const hasImage = menu.images && menu.images.length > 0;
                    return (
                      <div
                        key={menu.id}
                        onClick={() =>
                          hasImage &&
                          setMenuLightbox({ images: menu.images, index: 0 })
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
                        {/* <div className="px-3 py-2">
                          <p className="text-sm font-medium text-gray-800 truncate">{menu.title}</p>
                        </div> */}
                      </div>
                    );
                  })}
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
                  </div>
                  {menuLightbox.images.length > 1 && (
                    <div className="flex items-center justify-between mt-3">
                      <button
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
                        className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2">
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <span className="text-white text-sm">
                        {menuLightbox.index + 1} / {menuLightbox.images.length}
                      </span>
                      <button
                        onClick={() =>
                          setMenuLightbox(
                            (prev) =>
                              prev && {
                                ...prev,
                                index: (prev.index + 1) % prev.images.length,
                              },
                          )
                        }
                        className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Map */}
            {restaurantLocation && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Location
                </h2>
                <div className="h-[300px] rounded-lg overflow-hidden">
                  <GoogleMap
                    locations={mapLocation}
                    userLocation={restaurantLocation}
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
            />
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Reservation card */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#006653]" />
                <h3 className="font-semibold text-gray-900 text-lg">
                  Reserve a Table
                </h3>
              </div>

              {reservationDone ? (
                <div className="p-8 flex flex-col items-center text-center gap-3">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                  <p className="font-semibold text-gray-900 text-lg">
                    Reservation Confirmed!
                  </p>
                  <p className="text-sm text-gray-500">
                    We&apos;ll see you at {restaurant.title}.
                  </p>
                  <button
                    onClick={resetReservation}
                    className="mt-2 text-sm text-[#006653] underline underline-offset-2">
                    Make another reservation
                  </button>
                </div>
              ) : (
                <>
                  {/* Step 1 — Date */}
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                      1. Choose date
                    </p>
                    <DayPicker
                      mode="single"
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
                          2. Choose meal time
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
                        This restaurant is closed on the selected day.
                      </div>
                    ))}

                  {/* Step 3 — Time slot */}
                  {selectedMeal && currentMeal && (
                    <div className="p-4 border-b border-gray-100">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                        3. Choose time slot
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
                        4. Your details
                      </p>

                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
                          <Users className="h-3.5 w-3.5" /> Number of guests
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
                          Guest name
                        </label>
                        <input
                          type="text"
                          placeholder="Name for person who is booking"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value.replace(/[^a-zA-ZÀ-ÿğüşıöçĞÜŞİÖÇ\s]/g, ''))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#006653]/30 focus:border-[#006653]"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
                          <Phone className="h-3.5 w-3.5" /> Phone number
                        </label>
                        <input
                          type="tel"
                          placeholder="Mobile number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#006653]/30 focus:border-[#006653]"
                        />
                      </div>

                      {reservationError && (
                        <p className="text-red-500 text-xs">
                          {reservationError}
                        </p>
                      )}

                      <button
                        onClick={handleReservation}
                        disabled={
                          reserving || !guestName.trim() || !phone.trim()
                        }
                        className="w-full py-3 bg-[#006653] hover:bg-[#00543f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors">
                        {reserving ? 'Booking…' : 'Book a Table'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Quick info card */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                Quick Info
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                {restaurant.open_from && (
                  <div className="flex gap-2">
                    <Clock className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>Open from {restaurant.open_from}</span>
                  </div>
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
                    <span>Average price: {restaurant.average_price} AZN</span>
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
                      {' '}
                      from {restaurant.title} to your location
                    </span>
                  </div>
                </div>
              )}

              {restaurant.is_vip && (
                <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-700 font-medium">
                  ⭐ VIP Restaurant
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {feedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                Rating &amp; Feedback
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
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={feedbackName}
                      onChange={(e) => !user && setFeedbackName(e.target.value)}
                      readOnly={!!user}
                      placeholder="Name"
                      className={`w-full border rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        user ? 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Surname <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={feedbackSurname}
                      onChange={(e) => !user && setFeedbackSurname(e.target.value)}
                      readOnly={!!user}
                      placeholder="Surname"
                      className={`w-full border rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        user ? 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed' : 'border-gray-200'
                      }`}
                    />
                  </div>
                </div>
                {user && (
                  <p className="text-xs text-gray-400 mt-1">Name is taken from your account.</p>
                )}
              </div>

              {/* Rating */}
              <div>
                <p className="text-sm text-gray-700 mb-3">
                  {ratingLabels[feedbackHover || feedbackRating]}
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
                  I recommend this restaurant to my friends
                </span>
              </label>

              <div>
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  What impressed you?
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
                    <span className="text-xs">Upload images</span>
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
                  Write your feedback
                </p>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Write here..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                onClick={handleFeedbackSubmit}
                disabled={feedbackSubmitting || !feedbackName.trim() || !feedbackSurname.trim()}
                className="w-full py-3 bg-[#006653] hover:bg-[#00543f] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors">
                {feedbackSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
              {(!feedbackName.trim() || !feedbackSurname.trim()) && (
                <p className="text-xs text-red-500 text-center -mt-3">Name and Surname are required.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
