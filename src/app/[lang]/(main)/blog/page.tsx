import type { Metadata } from 'next';
import CustomBreadCrumb from '@/components/shared/CustomBreadcrumb';
import React from 'react';
import BlogSlider from '@/components/Blog/BlogSlider';
import BlogsSection from '@/components/Blog/BlogsSection';
import { pageAlternates } from '@/lib/seo';

interface BlogPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: { absolute: 'Bloq — Restoran və yemək bələdçisi | Harada Oturaq' },
    description:
      'Restoranlar, mətbəxlər və yemək trendləri haqqında məqalələr. Harada və nə yeməli olduğunu Harada Oturaq bloqunda öyrən.',
    alternates: pageAlternates(lang, '/blog'),
  };
}

const BREADCRUMB: Record<string, { home: string; blog: string }> = {
  az: { home: 'Ana səhifə', blog: 'Bloq' },
  en: { home: 'Home', blog: 'Blog' },
  ru: { home: 'Главная', blog: 'Блог' },
};

const BlogPage = async ({ params }: BlogPageProps) => {
  const { lang } = await params;
  const t = BREADCRUMB[lang] ?? BREADCRUMB.az;

  const blogBreadCrumbItems = [
    { label: t.home, href: `/${lang}` },
    { label: t.blog },
  ];

  return (
    <>
      <CustomBreadCrumb items={blogBreadCrumbItems} />
      <BlogSlider lang={lang} />
      <BlogsSection lang={lang} />
    </>
  );
};

export default BlogPage;
