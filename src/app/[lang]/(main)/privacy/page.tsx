import type { Metadata } from 'next';
import { cache } from 'react';
import privacyService, { PrivacyTranslation } from '@/services/privacy.service';
import { pageAlternates } from '@/lib/seo';
import { t } from '@/lib/i18n';

interface PrivacyPageProps {
  params: Promise<{ lang: string }>;
}

// Text and SEO fields are edited in the admin panel (Səhifələr → Məxfilik
// siyasəti); one request serves both generateMetadata and the page.
const getPrivacy = cache(async (lang: string) => {
  try {
    const res = await privacyService.getPrivacyPage();
    const tr = res.data?.translations as Record<string, PrivacyTranslation>;
    return {
      page: tr?.[lang]?.content ? tr[lang] : tr?.en ?? tr?.az ?? null,
      updatedAt: res.data?.updated_at ?? null,
    };
  } catch {
    return { page: null, updatedAt: null };
  }
});

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { lang } = await params;
  const { page } = await getPrivacy(lang);
  const fallback = t(lang, 'footer.privacy');
  return {
    title: { absolute: page?.seo_title || `${page?.title || fallback} — Harada Oturaq` },
    description: page?.seo_description || undefined,
    alternates: pageAlternates(lang, '/privacy'),
  };
}

const DATE_LOCALE: Record<string, string> = { az: 'az-Latn-AZ', en: 'en-GB', ru: 'ru-RU' };

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { lang } = await params;
  const { page, updatedAt } = await getPrivacy(lang);
  const date = updatedAt
    ? new Intl.DateTimeFormat(DATE_LOCALE[lang] ?? 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Baku',
      }).format(new Date(updatedAt))
    : null;

  return (
    <div className="wrapper pt-8 md:pt-12">
      <article className="mx-auto max-w-[800px]">
        <h1 className="text-[30px] md:text-[40px] font-bold leading-tight text-gray-900">
          {page?.title || t(lang, 'footer.privacy')}
        </h1>
        {date && (
          <p className="mt-3 mb-8 text-[14px] text-gray-500">
            {t(lang, 'privacy.updated', { date })}
          </p>
        )}
        {page?.content && (
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        )}
      </article>
    </div>
  );
}
