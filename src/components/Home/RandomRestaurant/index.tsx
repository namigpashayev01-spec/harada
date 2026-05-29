import apiClient from '@/api';
import Image from 'next/image';
import Link from 'next/link';

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
    const data = await apiClient.get<RandomRestaurantResponse>('/random-restaurant-campaign');
    return data;
  } catch (error) {
    console.error('Error fetching random restaurant campaign:', error);
    return null;
  }
};

interface RandomRestaurantProps {
  lang: string;
}

export default async function RandomRestaurant({ lang }: RandomRestaurantProps) {
  const response = await getRandomRestaurant();
  const campaignData = response?.data;

  const title = campaignData?.title || 'Təsadüfi restoran kampaniyası';
  const subtitle = campaignData?.subtitle || 'Sevimli restoranlarında xüsusi endirimlərdən yararlan və masanı indi rezerv et.';
  const value = campaignData?.value || '20% endirim';
  const imageUrl = campaignData?.image_url || '/images/banner-img.jpg';

  return (
    <section className="section">
      <div className="wrapper">
        <div className="rounded-[20px] overflow-hidden relative min-h-[42vh] w-full flex items-center">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="100vw"
            className="object-cover"
            style={{ transform: 'scaleX(-1)' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />

          <div className="relative z-20 w-full flex flex-col lg:flex-row lg:items-center justify-between gap-8 py-10 lg:py-14 px-6 sm:px-10 lg:px-[56px] text-white">
            <div className="max-w-full lg:max-w-[600px]">
              <span className="inline-flex items-center rounded-full bg-orange px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                Məhdud təklif
              </span>
              <h4 className="mt-4 text-3xl md:text-4xl lg:text-[46px] font-semibold leading-[1.1] tracking-tight">
                {title}
              </h4>
              <p className="text-sm sm:text-base lg:text-lg mt-3 text-white/85">
                {subtitle}
              </p>
              <Link
                href={`/${lang}/places`}
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-orange hover:bg-orange-hover px-7 py-3 text-sm font-semibold text-white transition-colors">
                İndi rezerv et
              </Link>
            </div>

            <div className="shrink-0 self-start lg:self-center">
              <span className="text-[#E0E19B] text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-semibold font-raleway leading-none">
                {value}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}