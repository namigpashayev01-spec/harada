import placeService from '@/services/place.service';
import RestaurantDetail from '@/components/Places/RestaurantDetail';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export default async function PlaceDetailPage({ params }: PageProps) {
  const { lang, slug } = await params;

  let restaurant = null;
  try {
    const res = await placeService.getRestaurantBySlug(slug);
    restaurant = res.data;
  } catch {
    notFound();
  }

  if (!restaurant) notFound();
  return <RestaurantDetail restaurant={restaurant} lang={lang} />;
}
