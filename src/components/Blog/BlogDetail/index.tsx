import React from 'react';
import Image from 'next/image';
import { Eye } from 'lucide-react';
import SimilarBlogs from '../SimilarBlogs';
import { getStaticBlog } from '@/data/staticBlogs';

interface BlogDetailProps {
  slug: string;
  lang: string;
}

const NOT_FOUND: Record<string, string> = {
  az: 'Bloq tapılmadı.',
  en: 'Blog post not found.',
  ru: 'Статья не найдена.',
};

const BlogDetail = ({ slug, lang }: BlogDetailProps) => {
  const blog = getStaticBlog(slug, lang);

  if (!blog) {
    return (
      <div className="wrapper py-[38px] text-center">
        <p className="text-gray-500">{NOT_FOUND[lang] ?? NOT_FOUND.az}</p>
      </div>
    );
  }

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
