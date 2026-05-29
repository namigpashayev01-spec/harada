import Header from '@/components/Header';
import BlogList from '@/components/Home/BlogList';
import Categories from '@/components/Home/Categories';
import PopularPlaces from '@/components/Home/PopularPlaces';
import RandomRestaurant from '@/components/Home/RandomRestaurant';

interface HomeProps {
  params: Promise<{ lang: string }>;
}

export default async function Home({ params }: HomeProps) {
  const { lang } = await params;

  return (
    <>
      <Header />
      <Categories />
      <PopularPlaces lang={lang} />
      <RandomRestaurant />
      <BlogList />
    </>
  );
}
