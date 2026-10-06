import type { Metadata } from 'next';
import {
  buildCountryHubMetadata,
  renderCountryHub,
  type CountryHubProps,
} from '@/lib/countryHub';

// /[lang]/canada — hub listing the Canadian cities we cover.
export async function generateMetadata(props: CountryHubProps): Promise<Metadata> {
  return buildCountryHubMetadata('CA', props);
}

export default async function Page(props: CountryHubProps) {
  return renderCountryHub('CA', props);
}
