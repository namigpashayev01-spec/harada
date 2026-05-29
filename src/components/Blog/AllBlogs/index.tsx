import BlogCard from '@/components/shared/BlogCard';
import { BlogItem } from '@/types/blog';
import React from 'react';

interface AllBlogsProps {
  currentItems: BlogItem[];
  lang: string;
}

const AllBlogs = ({ currentItems, lang }: AllBlogsProps) => {
  return (
    <>
      {currentItems.map((item) => (
        <BlogCard key={item.id} {...item} lang={lang} />
      ))}
    </>
  );
};

export default AllBlogs;
