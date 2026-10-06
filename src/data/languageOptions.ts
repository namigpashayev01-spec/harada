import Flag from '@/assets/images/us-flag.png';
import type { StaticImageData } from 'next/image';
type LanguageOption = {
  code: string;
  name: string;
  flag: StaticImageData;
};

export const languageOptions: LanguageOption[] = [
  {
    code: 'en',
    name: 'ENG',
    flag: Flag,
  },
  {
    code: 'az',
    name: 'AZ',
    flag: Flag,
  },
  {
    code: 'ru',
    name: 'RU',
    flag: Flag,
  },
  // Foreign-section languages — shown only on the pages that have them
  // (LanguageSwitcher filters by langsForPath).
  { code: 'sr', name: 'SRB', flag: Flag },
  { code: 'nl', name: 'NL', flag: Flag },
  { code: 'uz', name: 'UZ', flag: Flag },
  { code: 'fr', name: 'FR', flag: Flag },
  { code: 'lv', name: 'LV', flag: Flag },
];
