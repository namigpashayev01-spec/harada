import React from 'react';
import BlogCard from '@/components/shared/BlogCard';
import { getSimilarStaticBlogs } from '@/data/staticBlogs';

interface SimilarBlogsProps {
  slug: string;
  lang: string;
}

const HEADING: Record<string, string> = {
  az: 'Oxşar bloqlar',
  en: 'Similar Blogs',
  ru: 'Похожие статьи',
};

const SimilarBlogs = ({ slug, lang }: SimilarBlogsProps) => {
  const items = getSimilarStaticBlogs(slug, lang, 3);

  if (items.length === 0) return null;

  return (
    <section>
      <div className="wrapper py-[38px]">
        <h2 className="text-[28px] font-semibold mb-[24px]">
          {HEADING[lang] ?? HEADING.az}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
          {items.map((item) => (
            <BlogCard key={item.id} {...item} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimilarBlogs;
