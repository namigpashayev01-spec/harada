import type { Metadata } from 'next';
import {
  buildTaxonomyMetadata,
  renderTaxonomyPage,
  type TaxonomyPageProps,
} from '@/lib/taxonomyPage';

// /[lang]/uzbekistan/[city] — restaurants of one Uzbek city: Restaurant Guru
// imports first (in its ranking order), then OpenStreetMap ones (most complete
// first). Same server-rendered listing as the
// cuisine/district pages, so every restaurant gets a crawlable link.
export async function generateMetadata(props: TaxonomyPageProps): Promise<Metadata> {
  return buildTaxonomyMetadata('city', props);
}

export default async function Page(props: TaxonomyPageProps) {
  return renderTaxonomyPage('city', props);
}
