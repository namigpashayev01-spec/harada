import React from 'react';
import BlogDetail from '@/components/Blog/BlogDetail';

interface BlogDetailPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

const BlogDetailPage = async ({ params }: BlogDetailPageProps) => {
  const { lang, slug } = await params;

  return <BlogDetail lang={lang} slug={slug} />;
};

export default BlogDetailPage;
