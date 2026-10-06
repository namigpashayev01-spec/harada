import type { Metadata } from 'next';
import {
  buildCountryHubMetadata,
  renderCountryHub,
  type CountryHubProps,
} from '@/lib/countryHub';

// /[lang]/netherlands — hub listing the Dutch cities we cover.
export async function generateMetadata(props: CountryHubProps): Promise<Metadata> {
  return buildCountryHubMetadata('NL', props);
}

export default async function Page(props: CountryHubProps) {
  return renderCountryHub('NL', props);
}
