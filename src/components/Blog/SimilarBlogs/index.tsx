import React from 'react';
import BlogCard from '@/components/shared/BlogCard';
import blogService from '@/services/blog.service';
import { BlogItem } from '@/types/blog';

interface SimilarBlogsProps {
  slug: string;
  lang: string;
}

const HEADING: Record<string, string> = {
  az: 'Oxşar bloqlar',
  en: 'Similar Blogs',
  ru: 'Похожие статьи',
};

const SimilarBlogs = async ({ slug, lang }: SimilarBlogsProps) => {
  const items: BlogItem[] = await blogService
    .getSimilarBlogs(slug, lang)
    .then((res) => res.data ?? [])
    .catch(() => []);

  const visible = items.slice(0, 3);
  if (visible.length === 0) return null;

  return (
    <section>
      <div className="wrapper py-[38px]">
        <h2 className="text-[28px] font-semibold mb-[24px]">
          {HEADING[lang] ?? HEADING.en}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
          {visible.map((item) => (
            <BlogCard key={item.id} {...item} lang={lang} titleAs="h3" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimilarBlogs;
