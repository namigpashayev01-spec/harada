import type { Metadata } from 'next';
import {
  buildCountryHubMetadata,
  renderCountryHub,
  type CountryHubProps,
} from '@/lib/countryHub';

// /[lang]/latvia — hub listing the Latvian cities we cover.
export async function generateMetadata(props: CountryHubProps): Promise<Metadata> {
  return buildCountryHubMetadata('LV', props);
}

export default async function Page(props: CountryHubProps) {
  return renderCountryHub('LV', props);
}
