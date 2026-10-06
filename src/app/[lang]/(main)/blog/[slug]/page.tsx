import type { Metadata } from 'next';
import React from 'react';
import BlogDetail from '@/components/Blog/BlogDetail';
import blogService from '@/services/blog.service';
import { buildSocial } from '@/lib/seo';
import { ISlug } from '@/types';
import { getT } from '@/lib/i18n';

interface BlogDetailPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

const BRAND = 'Harada Oturaq';

const HREFLANG: Record<string, string> = {
  az: 'az-AZ',
  en: 'en-US',
  ru: 'ru-RU',
};

/**
 * Canonical + hreflang for a post, using each language's own slug.
 *
 * Blog slugs are translated ("saglam-qidalar" / "healthy-foods" /
 * "zdorovye-produkty"), so the generic pageAlternates() helper — which reuses
 * the current path across locales — would emit hreflang URLs that 404. A
 * language with no slug yet is left out rather than pointed at a dead URL.
 */
function blogAlternates(lang: string, slug: string, slugs?: ISlug) {
  const languages: Record<string, string> = {};

  for (const [code, hreflang] of Object.entries(HREFLANG)) {
    const localized = slugs?.[code as keyof ISlug];
    if (localized) languages[hreflang] = `/${code}/blog/${localized}`;
  }

  return {
    canonical: `/${lang}/blog/${slugs?.[lang as keyof ISlug] || slug}`,
    ...(Object.keys(languages).length > 1 ? { languages } : {}),
  };
}

const clamp = (text: string, max: number) => {
  const clean = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return clean.length > max ? clean.slice(0, max - 1).trimEnd() + '…' : clean;
};

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const t = getT(lang);
  try {
    // `lang` is required here: without it the API falls back to Azerbaijani and
    // every locale would get the Azerbaijani title and description.
    const res = await blogService.getBlog(slug, lang);
    const b = res.data;
    // Each language has its own slug, so hreflang cannot reuse the current one —
    // it has to point at that language's actual URL.
    const alternates = blogAlternates(lang, slug, b.slug);
    const name = b.seo_title || b.title || t('common.blog');
    const withBrand = `${name} | ${BRAND}`;
    const title = withBrand.length <= 60 ? withBrand : clamp(name, 60);
    const desc =
      b.seo_description ||
      b.description ||
      t('seo.blog.description', { title: b.title ?? t('common.article'), brand: BRAND });
    const cleanDesc = clamp(desc, 150);
    return {
      title: { absolute: title },
      description: cleanDesc,
      alternates,
      ...buildSocial({
        lang,
        title,
        description: cleanDesc,
        path: `/${lang}/blog/${slug}`,
        image: b.image || undefined,
        type: 'article',
      }),
    };
  } catch {
    const fallbackTitle = `${t('common.blog')} | ${BRAND}`;
    const fallbackDesc = t('seo.blog.fallbackDescription');
    return {
      title: { absolute: fallbackTitle },
      description: fallbackDesc,
      // Post unavailable — fall back to a self-referencing canonical only.
      alternates: { canonical: `/${lang}/blog/${slug}` },
      ...buildSocial({
        lang,
        title: fallbackTitle,
        description: fallbackDesc,
        path: `/${lang}/blog/${slug}`,
        type: 'article',
      }),
    };
  }
}

const BlogDetailPage = async ({ params }: BlogDetailPageProps) => {
  const { lang, slug } = await params;

  // BlogPosting + BreadcrumbList JSON-LD is emitted inside <BlogDetail> via
  // src/lib/article.ts — do not add a second copy here.
  return <BlogDetail lang={lang} slug={slug} />;
};

export default BlogDetailPage;
