import type { Metadata } from 'next';
import {
  buildCountryHubMetadata,
  renderCountryHub,
  type CountryHubProps,
} from '@/lib/countryHub';

// /[lang]/serbia — hub listing the Serbian cities we cover.
export async function generateMetadata(props: CountryHubProps): Promise<Metadata> {
  return buildCountryHubMetadata('RS', props);
}

export default async function Page(props: CountryHubProps) {
  return renderCountryHub('RS', props);
}
