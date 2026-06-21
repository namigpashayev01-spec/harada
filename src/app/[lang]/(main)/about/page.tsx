import type { Metadata } from 'next';
import AboutContent from '@/components/About/AboutContent';
import { pageAlternates } from '@/lib/seo';

interface AboutPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: { absolute: 'Haqqımızda — Harada Oturaq' },
    description:
      'Harada Oturaq restoran kəşf platformasıdır. Yaxınlığındakı ən yaxşı yemək yerlərini asanlıqla tapmaqda sənə kömək edirik.',
    alternates: pageAlternates(lang, '/about'),
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang } = await params;
  return (
    <div>
      <AboutContent lang={lang} />
    </div>
  );
}
