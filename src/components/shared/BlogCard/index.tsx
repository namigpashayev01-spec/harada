import React from 'react';
import { Eye } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ISlug } from '@/types';

interface BlogCardProps {
  id: number;
  title: string | null;
  image: string;
  date: string;
  view: number;
  slug: ISlug;
  lang: string;
}

const BlogCard = ({ id, title, image, date, view, slug, lang }: BlogCardProps) => {
  const slugValue = slug[lang as keyof ISlug] || slug.en || slug.az || String(id);
  const href = `/${lang}/blog/${slugValue}`;

  return (
    <Card className="w-full overflow-hidden pt-0 bg-white gap-0 pb-0">
      <Link href={href} className="block group">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={image}
            alt={title ?? ''}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="pt-[18px] px-[13px] pb-[8px]">
        <Link href={href}>
          <h2 className="text-xl font-bold text-gray-900 leading-tight mb-8 hover:text-blue-600 transition-colors cursor-pointer">
            {title}
          </h2>
        </Link>

        <div className="flex items-center justify-between text-sm text-black border-t border-t-[#ECECECEE] py-[18px]">
          <span>{date}</span>
          <div className="flex items-center gap-1">
            <span className="font-medium">{view}</span>
            <Eye className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BlogCard;
