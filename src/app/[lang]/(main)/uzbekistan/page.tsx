import type { Metadata } from 'next';
import {
  buildCountryHubMetadata,
  renderCountryHub,
  type CountryHubProps,
} from '@/lib/countryHub';

// /[lang]/uzbekistan — hub listing the Uzbek cities we cover.
export async function generateMetadata(props: CountryHubProps): Promise<Metadata> {
  return buildCountryHubMetadata('UZ', props);
}

export default async function Page(props: CountryHubProps) {
  return renderCountryHub('UZ', props);
}
