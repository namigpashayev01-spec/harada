'use client';

import React from 'react';
import Image from 'next/image';
import { Eye } from 'lucide-react';
import { useBlog } from '@/hooks/useBlog';
import SimilarBlogs from '../SimilarBlogs';

interface BlogDetailProps {
  slug: string;
  lang: string;
}

const BlogDetail = ({ slug, lang }: BlogDetailProps) => {
  const { data, isLoading, isError } = useBlog(slug);

  if (isLoading) {
    return (
      <div className="wrapper py-[38px] text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="wrapper py-[38px] text-center">
        <p className="text-gray-500">Blog post not found.</p>
      </div>
    );
  }

  const blog = data.data;

  return (
    <>
      <article>
        <div className="wrapper py-[38px]">
          <div className="relative w-full aspect-[16/7] rounded-[8px] overflow-hidden mb-[32px]">
            <Image
              src={blog.image}
              alt={blog.title ?? ''}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-[24px]">
            <span>{blog.date}</span>
            <div className="flex items-center gap-1">
              <span className="font-medium">{blog.view}</span>
              <Eye className="w-4 h-4" />
            </div>
          </div>

          {blog.title && (
            <h1 className="text-[32px] lg:text-[40px] font-bold text-gray-900 leading-tight mb-[24px]">
              {blog.title}
            </h1>
          )}

          {blog.description && (
            <div
              className="prose prose-lg max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: blog.description }}
            />
          )}
        </div>
      </article>

      <SimilarBlogs slug={slug} lang={lang} />
    </>
  );
};

export default BlogDetail;
