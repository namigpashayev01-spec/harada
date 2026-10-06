import type { Metadata } from 'next';
import {
  buildTaxonomyMetadata,
  renderTaxonomyPage,
  type TaxonomyPageProps,
} from '@/lib/taxonomyPage';

export async function generateMetadata(props: TaxonomyPageProps): Promise<Metadata> {
  return buildTaxonomyMetadata('cuisine', props);
}

export default async function Page(props: TaxonomyPageProps) {
  return renderTaxonomyPage('cuisine', props);
}
