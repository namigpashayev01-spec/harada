'use client';
import React, { useMemo, useState } from 'react';
import AllBlogs from '../AllBlogs';
import BlogPagination from '../BlogsPagination';
import { getStaticBlogs } from '@/data/staticBlogs';

interface BlogsSectionProps {
  lang: string;
}

const PER_PAGE = 6;

const BlogsSection = ({ lang }: BlogsSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const allBlogs = useMemo(() => getStaticBlogs(lang), [lang]);

  const totalPages = Math.max(1, Math.ceil(allBlogs.length / PER_PAGE));
  const currentItems = allBlogs.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  };

  return (
    <section>
      <div className="wrapper">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px] py-[38px]">
          <AllBlogs currentItems={currentItems} lang={lang} />
        </div>

        {totalPages > 1 && (
          <BlogPagination
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            currentPage={currentPage}
            getPageNumbers={getPageNumbers}
          />
        )}
      </div>
    </section>
  );
};

export default BlogsSection;
