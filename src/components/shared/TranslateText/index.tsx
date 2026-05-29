'use client';

import { useTranslate } from '@/context/TranlateContext';

export function TranslatedText({ textKey }: { textKey: string }) {
  const translatedText = useTranslate(textKey);
  return <>{translatedText}</>;
}
