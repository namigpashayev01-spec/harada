'use client';

import React from 'react';
import { useSimilarBlogs } from '@/hooks/useSimilarBlogs';
import BlogCard from '@/components/shared/BlogCard';

interface SimilarBlogsProps {
  slug: string;
  lang: string;
}

const SimilarBlogs = ({ slug, lang }: SimilarBlogsProps) => {
  const { data, isLoading, isError } = useSimilarBlogs(slug);

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (isError || !data || data.data.length === 0) return null;

  return (
    <section>
      <div className="wrapper py-[38px]">
        <h2 className="text-[28px] font-semibold mb-[24px]">Similar Blogs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
          {data.data.map((item) => (
            <BlogCard key={item.id} {...item} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimilarBlogs;
