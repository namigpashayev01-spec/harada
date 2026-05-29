import apiClient from '@/api';
import Image from 'next/image';

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

export default async function RandomRestaurant() {
  const response = await getRandomRestaurant();
  const campaignData = response?.data;

  const title = campaignData?.title || 'Random Restaurant campaign';
  const subtitle = campaignData?.subtitle || 'Lorem ipsum dolor sit amet consectetur. Vel nullam adipiscing nec arcu vel justo.';
  const value = campaignData?.value || '20% off';
  const imageUrl = campaignData?.image_url || '/images/banner-img.jpg';

  return (
    <section>
      <div className="wrapper">
        <div className="rounded-[12px] overflow-hidden relative min-h-[40vh] w-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            style={{ transform: 'scaleX(-1)' }}
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="flex flex-col lg:flex-row items-start lg:items-center h-[40vh] justify-between py-6 sm:py-8 lg:py-[46px] pl-4 sm:pl-6 lg:pl-[45px] text-white z-20 relative">
            <div className="max-w-full sm:max-w-[400px] lg:max-w-[555px] mb-4 lg:mb-0">
              <h4 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-semibold leading-tight">
                {title}
              </h4>
              <p className="text-sm sm:text-base lg:text-lg mt-2">
                {subtitle}
              </p>
            </div>
            <div className="pr-4 sm:pr-8 md:pr-16 lg:pr-[200px] self-end lg:self-auto">
              <span className="text-[#E0E19B] text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-semibold font-raleway">
                {value}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}