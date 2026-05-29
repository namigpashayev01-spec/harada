import apiClient from '@/api';
import Image from 'next/image';
import Link from 'next/link';
import BannerImg from '@/assets/images/banner-img.jpg';

interface RandomRestaurantData {
  id: number;
  title: string | null;
  subtitle: string | null;
  value: string | null;
  image_url: string;
}

interface RandomRestaurantResponse {
  data: RandomRestaurantData;
}

const getRandomRestaurant = async (): Promise<RandomRestaurantResponse | null> => {
  try {
    // Short timeout so a slow/unavailable backend doesn't block SSR for 30s.
    const data = await apiClient.get<RandomRestaurantResponse>(
      '/random-restaurant-campaign',
      { timeout: 2500 },
    );
    return data;
  } catch {
    // Non-fatal: fall back to the default advertisement content below.
    console.warn('[RandomRestaurant] campaign unavailable — showing default content');
    return null;
  }
};

interface Dict {
  badge: string;
  title: string;
  subtitle: string;
  value: string;
  button: string;
}

// Default advertisement content shown until an admin uploads a campaign.
const DICT: Record<string, Dict> = {
  az: {
    badge: 'Tövsiyə olunan restoran',
    title: 'Şəhərin ən yaxşı restoranını kəşf et',
    subtitle:
      'Seçilmiş restoranlarda xüsusi təkliflərdən yararlan və masanı indi rezerv et.',
    value: '20% endirim',
    button: 'İndi rezerv et',
  },
  en: {
    badge: 'Featured restaurant',
    title: "Discover the city's finest restaurant",
    subtitle:
      'Enjoy special offers at selected restaurants and book your table now.',
    value: '20% off',
    button: 'Book now',
  },
  ru: {
    badge: 'Рекомендуемый ресторан',
    title: 'Откройте лучший ресторан города',
    subtitle:
      'Пользуйтесь спецпредложениями в избранных ресторанах и бронируйте столик прямо сейчас.',
    value: 'Скидка 20%',
    button: 'Забронировать',
  },
};

interface RandomRestaurantProps {
  lang: string;
}

export default async function RandomRestaurant({ lang }: RandomRestaurantProps) {
  const t = DICT[lang] ?? DICT.az;
  const response = await getRandomRestaurant();
  const campaignData = response?.data;

  // Admin-provided values override the localized defaults.
  const title = campaignData?.title || t.title;
  const subtitle = campaignData?.subtitle || t.subtitle;
  const value = campaignData?.value || t.value;
  const imageUrl = campaignData?.image_url || BannerImg;

  return (
    <section className="section">
      <div className="wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          {/* Text panel */}
          <div className="order-2 lg:order-1 flex flex-col justify-center bg-gradient-to-br from-[#013a30] via-[#006653] to-[#0a7d54] p-8 sm:p-10 lg:p-12 text-white">
            <span className="inline-flex w-fit items-center rounded-full bg-[#9fe870] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#14532d]">
              {t.badge}
            </span>
            <h4 className="mt-4 text-3xl md:text-4xl lg:text-[44px] font-semibold leading-[1.1] tracking-tight">
              {title}
            </h4>
            <p className="mt-3 text-sm sm:text-base lg:text-lg text-white/85">
              {subtitle}
            </p>
            <Link
              href={`/${lang}/places`}
              className="mt-6 inline-flex w-fit items-center justify-center rounded-xl bg-[#9fe870] px-7 py-3 text-sm font-semibold text-[#14532d] transition-colors hover:bg-[#8fdc5c]">
              {t.button}
            </Link>
          </div>

          {/* Advertisement image — fully visible */}
          <div className="relative order-1 lg:order-2 min-h-[240px] sm:min-h-[300px] lg:min-h-[400px]">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {/* Eye-catching discount badge */}
            {value && (
              <span className="absolute top-4 right-4 rounded-full bg-[#9fe870] px-4 py-2 text-base sm:text-lg font-bold text-[#14532d] shadow-lg font-raleway">
                {value}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
