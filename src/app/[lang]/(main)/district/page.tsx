import type { Metadata } from 'next';
import taxonomyService from '@/services/taxonomy.service';
import TaxonomyIndex from '@/components/Taxonomy/TaxonomyIndex';
import { getT } from '@/lib/i18n';
import { buildSocial, pageAlternates } from '@/lib/seo';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = getT(lang);
  const title = t('tax.index.districts');
  const description = t('tax.index.districts.lead');
  return {
    title: { absolute: `${title} | Harada Oturaq` },
    description,
    alternates: pageAlternates(lang, '/district'),
    ...buildSocial({ lang, title, description, path: `/${lang}/district` }),
  };
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const terms = await taxonomyService
    .getTaxonomies(lang)
    .then((res) => res.districts ?? [])
    .catch(() => []);

  return <TaxonomyIndex lang={lang} type="district" terms={terms} />;
}
