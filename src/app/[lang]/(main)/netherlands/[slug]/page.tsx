import type { Metadata } from 'next';
import {
  buildTaxonomyMetadata,
  renderTaxonomyPage,
  type TaxonomyPageProps,
} from '@/lib/taxonomyPage';

// /[lang]/netherlands/[city] — restaurants of one Dutch city, imported from
// OpenStreetMap (most complete first). Same server-rendered listing as the
// cuisine/district pages, so every restaurant gets a crawlable link.
export async function generateMetadata(props: TaxonomyPageProps): Promise<Metadata> {
  return buildTaxonomyMetadata('city', props);
}

export default async function Page(props: TaxonomyPageProps) {
  return renderTaxonomyPage('city', props);
}
