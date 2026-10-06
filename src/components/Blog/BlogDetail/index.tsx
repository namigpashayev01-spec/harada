import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Eye, Clock, ListOrdered, UtensilsCrossed, ArrowRight } from 'lucide-react';
import SimilarBlogs from '../SimilarBlogs';
import blogService from '@/services/blog.service';
import { BlogItem } from '@/types/blog';
import { prepareArticle, readingMinutes } from '@/lib/article';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { ISlug } from '@/types';

interface BlogDetailProps {
  slug: string;
  lang: string;
}

const LABELS: Record<
  string,
  {
    toc: string;
    minRead: string;
    ctaTitle: string;
    ctaText: string;
    ctaButton: string;
    home: string;
    blog: string;
  }
> = {
  az: {
    toc: 'Bu yazıda nə var?',
    minRead: 'dəq oxunuş',
    ctaTitle: 'Bu yazını oxudun — indi masanı seç',
    ctaText:
      'Yaxınlığındakı restoranların menyusuna, qiymətlərinə və iş saatlarına bax, masanı onlayn rezerv et.',
    ctaButton: 'Restoranlara bax',
    home: 'Ana səhifə',
    blog: 'Bloq',
  },
  en: {
    toc: 'What’s in this article?',
    minRead: 'min read',
    ctaTitle: 'Finished reading? Now pick your table',
    ctaText:
      'Browse menus, prices and opening hours of restaurants near you, and book a table online.',
    ctaButton: 'Browse restaurants',
    home: 'Home',
    blog: 'Blog',
  },
  ru: {
    toc: 'Что в этой статье?',
    minRead: 'мин чтения',
    ctaTitle: 'Дочитали? Теперь выберите столик',
    ctaText:
      'Смотрите меню, цены и часы работы ресторанов рядом с вами и бронируйте столик онлайн.',
    ctaButton: 'Смотреть рестораны',
    home: 'Главная',
    blog: 'Блог',
  },
};

const getSlug = (slug: ISlug, lang: string) =>
  slug?.[lang as keyof ISlug] || slug?.az || slug?.en || '';

const BlogDetail = async ({ slug, lang }: BlogDetailProps) => {
  const t = LABELS[lang] ?? LABELS.en;

  const blog: BlogItem | null = await blogService
    .getBlog(slug, lang)
    .then((res) => res.data)
    .catch(() => null);

  // Unknown slug, unpublished post, or API down — a 404 is the honest answer.
  if (!blog?.title) notFound();

  const body = blog.description ?? '';
  const { html, headings } = prepareArticle(body);
  const minutes = readingMinutes(body);

  // Only worth showing a table of contents once an article is long enough that
  // a reader would otherwise have to scroll blindly.
  const toc = headings.filter((h) => h.level === 2);
  const showToc = toc.length >= 3;

  const canonicalSlug = getSlug(blog.slug, lang) || slug;

  const jsonLd = [
    articleJsonLd({
      lang,
      headline: blog.title,
      description: blog.seo_description ?? '',
      slug: canonicalSlug,
      image: blog.image || undefined,
      published: blog.date_iso ?? undefined,
    }),
    breadcrumbJsonLd([
      { name: t.home, path: `/${lang}` },
      { name: t.blog, path: `/${lang}/blog` },
      { name: blog.title, path: `/${lang}/blog/${canonicalSlug}` },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <div className="wrapper py-[38px] max-w-[860px]">
          {blog.image && (
            <div className="relative w-full aspect-[16/7] rounded-[12px] overflow-hidden mb-[28px]">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                sizes="(max-width: 900px) 100vw, 860px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <h1 className="text-[30px] lg:text-[42px] font-bold text-gray-900 leading-tight mb-[18px]">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 pb-[24px] mb-[28px] border-b border-gray-200">
            {blog.date_iso ? (
              <time dateTime={blog.date_iso}>{blog.date}</time>
            ) : (
              <span>{blog.date}</span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {minutes} {t.minRead}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {blog.view}
            </span>
          </div>

          {showToc && (
            <nav
              aria-label={t.toc}
              className="mb-[32px] rounded-[12px] border border-gray-200 bg-[#fafafa] p-5">
              <p className="flex items-center gap-2 font-bold text-gray-900 mb-3">
                <ListOrdered className="w-[18px] h-[18px] text-brand-ink" />
                {t.toc}
              </p>
              <ol className="space-y-2">
                {toc.map((h, i) => (
                  <li key={h.id} className="flex gap-2 text-[15px]">
                    <span className="text-gray-400 shrink-0">{i + 1}.</span>
                    <a
                      href={`#${h.id}`}
                      className="text-gray-700 hover:text-brand-ink hover:underline underline-offset-4">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* Every article ends by pushing the reader back into the product. */}
          <aside className="mt-[44px] rounded-[16px] bg-brand-soft border border-[#d5efc0] p-6 md:p-8">
            <h2 className="flex items-center gap-2 text-[20px] md:text-[24px] font-bold text-gray-900 mb-2">
              <UtensilsCrossed className="w-6 h-6 text-brand-ink shrink-0" />
              {t.ctaTitle}
            </h2>
            <p className="text-gray-700 mb-5">{t.ctaText}</p>
            <Link
              href={`/${lang}/places`}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-hover">
              {t.ctaButton}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </article>

      <SimilarBlogs slug={slug} lang={lang} />
    </>
  );
};

export default BlogDetail;
