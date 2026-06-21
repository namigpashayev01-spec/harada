import type { Metadata } from 'next';
import Header from '@/components/Header';
import MobileStickySearch from '@/components/layout/MobileStickySearch';
import BlogList from '@/components/Home/BlogList';
import Categories from '@/components/Home/Categories';
import PopularPlaces from '@/components/Home/PopularPlaces';
import RandomRestaurant from '@/components/Home/RandomRestaurant';
import BestOffers from '@/components/Home/BestOffers';
import { pageAlternates } from '@/lib/seo';

interface HomeProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: { absolute: 'Harada Oturaq — Restoranlar, Rezervasiya və Endirim' },
    description:
      'Yaxınlığındakı ən yaxşı restoranları tap, menyu və qiymətlərə bax, onlayn rezervasiya et və xüsusi endirimlərdən yararlan.',
    alternates: pageAlternates(lang, ''),
  };
}

export default async function Home({ params }: HomeProps) {
  const { lang } = await params;

  return (
    <>
      <MobileStickySearch />
      <Header lang={lang} />
      <Categories />
      <PopularPlaces lang={lang} />
      <RandomRestaurant lang={lang} />
      <BestOffers lang={lang} />
      <BlogList />
    </>
  );
}
