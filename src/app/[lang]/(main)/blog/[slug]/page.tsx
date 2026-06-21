import type { Metadata } from 'next';
import React from 'react';
import BlogDetail from '@/components/Blog/BlogDetail';
import blogService from '@/services/blog.service';
import { pageAlternates } from '@/lib/seo';

interface BlogDetailPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

const BRAND = 'Harada Oturaq';

const clamp = (text: string, max: number) => {
  const clean = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return clean.length > max ? clean.slice(0, max - 1).trimEnd() + '…' : clean;
};

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const alternates = pageAlternates(lang, `/blog/${slug}`);
  try {
    const res = await blogService.getBlog(slug);
    const b = res.data;
    const name = b.seo_title || b.title || 'Bloq';
    const withBrand = `${name} | ${BRAND}`;
    const title = withBrand.length <= 60 ? withBrand : clamp(name, 60);
    const desc =
      b.seo_description ||
      b.description ||
      `${b.title ?? 'Məqalə'} — ${BRAND} bloqunda oxu.`;
    return {
      title: { absolute: title },
      description: clamp(desc, 150),
      alternates,
    };
  } catch {
    return {
      title: { absolute: `Bloq | ${BRAND}` },
      description:
        'Restoranlar və yemək haqqında məqalə. Harada Oturaq bloqunda oxu.',
      alternates,
    };
  }
}

const BlogDetailPage = async ({ params }: BlogDetailPageProps) => {
  const { lang, slug } = await params;

  return <BlogDetail lang={lang} slug={slug} />;
};

export default BlogDetailPage;
