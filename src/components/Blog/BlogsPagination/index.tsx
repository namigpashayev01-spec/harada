import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

interface BlogPaginationProps {
  totalPages: number;
  handlePageChange: (page: number) => void;
  currentPage: number;
  getPageNumbers: () => (string | number)[];
}

const BlogPagination: React.FC<BlogPaginationProps> = ({
  totalPages,
  handlePageChange,
  currentPage,
  getPageNumbers,
}) => {
  return (
    <div>
      {totalPages > 1 && (
        <div className="flex items-end justify-end pb-[38px]">
          <Pagination className="items-end justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      handlePageChange(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      className={cn(
                        'transition-colors duration-200',
                        currentPage === page && [
                          'bg-[#13453D]',
                          'text-white',
                          'hover:bg-[#13453D]',
                          'hover:text-white',
                          'border-[#13453D]',
                          'shadow-sm',
                        ]
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page as number);
                      }}
                      isActive={currentPage === page}>
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage === totalPages
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default BlogPagination;
