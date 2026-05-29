'use client';
import React, { useState } from 'react';
import { useBlogs } from '@/hooks/useBlogs';
import AllBlogs from '../AllBlogs';
import BlogPagination from '../BlogsPagination';

interface BlogsSectionProps {
  lang: string;
}

const BlogsSection = ({ lang }: BlogsSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError } = useBlogs(currentPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = data?.meta.last_page ?? 1;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (isLoading) {
    return (
      <section>
        <div className="wrapper">
          <div className="py-[38px] text-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !data || data.data.length === 0) {
    return (
      <section>
        <div className="wrapper">
          <div className="py-[38px] text-center">
            <p className="text-gray-500">No blog posts available.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="wrapper">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px] py-[38px]">
          <AllBlogs currentItems={data.data} lang={lang} />
        </div>

        <BlogPagination
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          currentPage={currentPage}
          getPageNumbers={getPageNumbers}
        />
      </div>
    </section>
  );
};

export default BlogsSection;
