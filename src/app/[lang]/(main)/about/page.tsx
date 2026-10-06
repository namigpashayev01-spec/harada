import type { Metadata } from 'next';
import AboutContent from '@/components/About/AboutContent';
import { pageAlternates } from '@/lib/seo';
import { t } from '@/lib/i18n';

interface AboutPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: { absolute: t(lang, 'seo.about.title') },
    description: t(lang, 'seo.about.description'),
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
