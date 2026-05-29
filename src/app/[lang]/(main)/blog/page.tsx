import CustomBreadCrumb from '@/components/shared/CustomBreadcrumb';
import React from 'react';
import BlogSlider from '@/components/Blog/BlogSlider';
import BlogsSection from '@/components/Blog/BlogsSection';

interface BlogPageProps {
  params: Promise<{ lang: string }>;
}

const BlogPage = async ({ params }: BlogPageProps) => {
  const { lang } = await params;

  const blogBreadCrumbItems = [
    { label: 'Restaurants', href: '/restaurants' },
    { label: 'Barcelona', href: '/restaurants/barcelona' },
    { label: 'The 10 Best Restaurants in Barcelona' },
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
