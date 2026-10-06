import type { Metadata } from 'next';
import placeService from '@/services/place.service';
import RestaurantDetail from '@/components/Places/RestaurantDetail';
import { notFound } from 'next/navigation';
import { pageAlternates, buildSocial } from '@/lib/seo';
import {
  restaurantSchema,
  breadcrumbSchema,
  placeCrumbs,
} from '@/lib/schema';
import JsonLd from '@/components/JsonLd';
import { getT } from '@/lib/i18n';

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

// Restoran başlıqlarında brend domen formasında yazılır (seo_title ilə eyni).
const BRAND = 'Harada-oturaq.az';

// Strip HTML tags and collapse whitespace, then clamp to a max length.
const clamp = (text: string, max: number) => {
  const clean = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return clean.length > max ? clean.slice(0, max - 1).trimEnd() + '…' : clean;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const t = getT(lang);
  const alternates = pageAlternates(lang, `/places/${slug}`);
  try {
    const res = await placeService.getRestaurantBySlug(slug, lang);
    const r = res.data;
    // seo_title admin/skript tərəfindən brendlə birlikdə hazırlanır
    // ("<ad> – Menyu və Rezerv Edin | Harada-oturaq.az"), ona görə brendi
    // yalnız ada geri qayıtdıqda əlavə edirik — yoxsa ikiqat brend çıxır.
    // Burada KƏSMİRİK: 60-dan uzun olsa da tam başlıq <title>-a yazılır, əks
    // halda brend HTML-dən itir. Göstərişdə qısaltmanı Google özü edir.
    const seo = (r.seo_title || '').trim();
    const title = seo
      ? seo
      : (() => {
          const name = r.title || t('common.restaurant');
          const withBrand = `${name} | ${BRAND}`;
          return withBrand.length <= 60 ? withBrand : clamp(name, 60);
        })();
    const desc =
      r.seo_description ||
      r.description ||
      t('seo.place.description', { title: r.title, brand: BRAND });
    const cleanDesc = clamp(desc, 150);
    return {
      title: { absolute: title },
      description: cleanDesc,
      alternates,
      // Fact-thin imported restaurants (no photo, menu or reviews) stay
      // crawlable but out of the index — see Restoran::isIndexable() on the API.
      ...(r.indexable === false ? { robots: { index: false, follow: true } } : {}),
      ...buildSocial({
        lang,
        title,
        description: cleanDesc,
        path: `/${lang}/places/${slug}`,
        image: r.image || undefined,
      }),
    };
  } catch {
    const fallbackTitle = `${t('common.restaurant')} | ${BRAND}`;
    const fallbackDesc = t('seo.place.fallbackDescription');
    return {
      title: { absolute: fallbackTitle },
      description: fallbackDesc,
      alternates,
      ...buildSocial({
        lang,
        title: fallbackTitle,
        description: fallbackDesc,
        path: `/${lang}/places/${slug}`,
      }),
    };
  }
}

export default async function PlaceDetailPage({ params }: PageProps) {
  const { lang, slug } = await params;

  let restaurant = null;
  try {
    const res = await placeService.getRestaurantBySlug(slug, lang);
    restaurant = res.data;
  } catch {
    notFound();
  }

  if (!restaurant) notFound();

  // Structured data: the Restaurant node carries address, geo, phone, cuisine,
  // price range and opening hours; the breadcrumb renders the trail in the SERP.
  const schema = [
    restaurantSchema(restaurant, lang, slug),
    breadcrumbSchema(placeCrumbs(lang, restaurant.title, undefined, restaurant)),
  ];

  return (
    <>
      <JsonLd data={schema} />
      <RestaurantDetail restaurant={restaurant} lang={lang} />
    </>
  );
}
