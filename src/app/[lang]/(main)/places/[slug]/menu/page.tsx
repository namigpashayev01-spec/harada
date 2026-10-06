import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import placeService from '@/services/place.service';
import RestaurantMenu from '@/components/Places/RestaurantMenu';
import { notFound } from 'next/navigation';
import { pageAlternates, buildSocial } from '@/lib/seo';
import { getT } from '@/lib/i18n';
import {
  buildMenuDescription,
  buildMenuTitle,
  collectMenuFacts,
  dishesLabel,
} from '@/lib/menuSeo';
import { menuSchema, breadcrumbSchema } from '@/lib/schema';
import JsonLd from '@/components/JsonLd';

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

// Restoran başlıqlarında brend domen formasında yazılır (seo_title ilə eyni).
const BRAND = 'Harada-oturaq.az';

const MENU_WORD: Record<string, string> = { az: 'Menyu', en: 'Menu', ru: 'Меню' };
const PLACES_WORD: Record<string, string> = {
  az: 'Məkanlar',
  en: 'Places',
  ru: 'Места',
};
const BACK_WORD: Record<string, string> = {
  az: 'Restorana qayıt',
  en: 'Back to restaurant',
  ru: 'К ресторану',
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const t = getT(lang);
  const menuWord = MENU_WORD[lang] ?? MENU_WORD.en;
  const alternates = pageAlternates(lang, `/places/${slug}/menu`);
  try {
    const res = await placeService.getRestaurantBySlug(slug, lang);
    const r = res.data;
    const name = r.title || t('common.restaurant');
    const facts = collectMenuFacts(name, r.menu_categories ?? []);
    const title = buildMenuTitle(lang, name);
    const description = buildMenuDescription(lang, facts);
    return {
      title: { absolute: title },
      description,
      // Only 359 of ~812 restaurants have menu content. The rest render an
      // empty menu page, and letting hundreds of those into the index is a
      // thin-content problem, so they are kept out until a menu is added.
      // `follow` still passes link equity through to the restaurant page.
      // Stated explicitly rather than left to the root layout: passing
      // `undefined` here clears the inherited value and emits no robots tag at
      // all, which reads as an oversight next to every other page on the site.
      robots:
        facts.dishCount > 0
          ? { index: true, follow: true }
          : { index: false, follow: true },
      alternates,
      ...buildSocial({
        lang,
        title,
        description,
        path: `/${lang}/places/${slug}/menu`,
        image: r.image || undefined,
      }),
    };
  } catch {
    const fallback = `${menuWord} | ${BRAND}`;
    const description = t('seo.menu.fallbackDescription');
    return {
      title: { absolute: fallback },
      description,
      alternates,
      ...buildSocial({
        lang,
        title: fallback,
        description,
        path: `/${lang}/places/${slug}/menu`,
      }),
    };
  }
}

export default async function RestaurantMenuPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const menuWord = MENU_WORD[lang] ?? MENU_WORD.en;
  const placesWord = PLACES_WORD[lang] ?? PLACES_WORD.en;
  const backWord = BACK_WORD[lang] ?? BACK_WORD.en;

  let restaurant = null;
  try {
    const res = await placeService.getRestaurantBySlug(slug, lang);
    restaurant = res.data;
  } catch {
    notFound();
  }
  if (!restaurant) notFound();

  const t = getT(lang);
  const detailHref = `/${lang}/places/${slug}`;
  const name = restaurant.title || t('common.restaurant');
  const facts = collectMenuFacts(name, restaurant.menu_categories ?? []);

  // Same numbers the meta description leads with — a searcher who clicks
  // through sees them confirmed on the page instead of hunting for prices.
  const summary = [
    facts.dishCount > 0 ? dishesLabel(lang, facts.dishCount) : null,
    facts.sections.length > 0
      ? t('menu.sectionCount', { n: facts.sections.length })
      : null,
    facts.minPrice != null && facts.maxPrice != null && facts.maxPrice > facts.minPrice
      ? `${facts.minPrice}–${facts.maxPrice} ₼`
      : facts.minPrice != null
        ? `${facts.minPrice} ₼+`
        : null,
  ].filter(Boolean);

  // Menu JSON-LD only where dishes exist — the same condition that keeps empty
  // menu pages out of the index. The breadcrumb mirrors the visible trail below.
  const schema = [
    menuSchema(restaurant, lang, slug, restaurant.menu_categories ?? []),
    breadcrumbSchema([
      { name: t('nav.home'), path: `/${lang}` },
      { name: placesWord, path: `/${lang}/places` },
      { name, path: detailHref },
      { name: menuWord },
    ]),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd data={schema} />
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href={`/${lang}`}>
              <Home className="h-4 w-4 hover:text-[#006653]" />
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={`/${lang}/places`}
              className="hover:text-[#006653] transition-colors">
              {placesWord}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={detailHref}
              className="hover:text-[#006653] transition-colors truncate max-w-[160px]">
              {name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{menuWord}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 pb-16">
        {/* Header card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm mb-6 flex items-center gap-4">
          {restaurant.image && (
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              <Image
                src={restaurant.image}
                alt={name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="min-w-0">
            <Link
              href={detailHref}
              className="inline-flex items-center gap-1.5 text-sm text-[#006653] hover:underline underline-offset-2 mb-1">
              <ArrowLeft className="h-4 w-4" />
              {backWord}
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {name} — {menuWord}
            </h1>
            {summary.length > 0 && (
              <p className="mt-1 text-sm text-gray-500">{summary.join(' · ')}</p>
            )}
          </div>
        </div>

        <RestaurantMenu restaurant={restaurant} lang={lang} />
      </div>
    </div>
  );
}
