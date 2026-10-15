import type { Metadata } from 'next';
import Header from '@/components/Header';
import MobileStickySearch from '@/components/layout/MobileStickySearch';
import BlogList from '@/components/Home/BlogList';
import Categories from '@/components/Home/Categories';
import PopularPlaces from '@/components/Home/PopularPlaces';
import BestOffers from '@/components/Home/BestOffers';
import blogService from '@/services/blog.service';
import placeService from '@/services/place.service';
import { pageAlternates } from '@/lib/seo';
import { t } from '@/lib/i18n';

interface HomeProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: { absolute: t(lang, 'seo.home.title') },
    description: t(lang, 'seo.home.description'),
    alternates: pageAlternates(lang, ''),
  };
}

export default async function Home({ params }: HomeProps) {
  const { lang } = await params;

  // Server-fetched so the carousel's posts land in the initial HTML.
  const latestBlogs = await blogService
    .getLatestBlogs(lang)
    .then((res) => res.data ?? [])
    .catch(() => []);

  // Same reason, and it matters more here: without it the home page shipped
  // zero links to any restaurant, leaving every detail page an orphan.
  const popular = await placeService.getPopularPlaces().catch(() => undefined);

  return (
    <>
      <MobileStickySearch />
      <Header lang={lang} />
      <Categories />
      <PopularPlaces lang={lang} initialData={popular} />
      <BestOffers lang={lang} />
      <BlogList blogs={latestBlogs} />
    </>
  );
}
