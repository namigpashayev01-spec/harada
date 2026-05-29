import CustomBreadCrumb from '@/components/shared/CustomBreadcrumb';
import React from 'react';
import BlogSlider from '@/components/Blog/BlogSlider';
import BlogsSection from '@/components/Blog/BlogsSection';

interface BlogPageProps {
  params: Promise<{ lang: string }>;
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
