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
];
