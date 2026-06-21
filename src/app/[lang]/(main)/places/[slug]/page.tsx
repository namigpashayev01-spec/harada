import type { Metadata } from 'next';
import placeService from '@/services/place.service';
import RestaurantDetail from '@/components/Places/RestaurantDetail';
import { notFound } from 'next/navigation';
import { pageAlternates } from '@/lib/seo';

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

const BRAND = 'Harada Oturaq';

// Strip HTML tags and collapse whitespace, then clamp to a max length.
const clamp = (text: string, max: number) => {
  const clean = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return clean.length > max ? clean.slice(0, max - 1).trimEnd() + '…' : clean;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const alternates = pageAlternates(lang, `/places/${slug}`);
  try {
    const res = await placeService.getRestaurantBySlug(slug);
    const r = res.data;
    const name = r.seo_title || r.title || 'Restoran';
    const withBrand = `${name} | ${BRAND}`;
    const title = withBrand.length <= 60 ? withBrand : clamp(name, 60);
    const desc =
      r.seo_description ||
      r.description ||
      `${r.title} — ünvan, menyu, qiymət və rəylər. ${BRAND} ilə onlayn rezervasiya et.`;
    return {
      title: { absolute: title },
      description: clamp(desc, 150),
      alternates,
    };
  } catch {
    return {
      title: { absolute: `Restoran | ${BRAND}` },
      description:
        'Restoran haqqında ətraflı məlumat: ünvan, menyu, qiymət və rəylər. Onlayn rezervasiya et.',
      alternates,
    };
  }
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
