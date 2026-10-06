import type { Metadata } from 'next';
import CustomBreadCrumb from '@/components/shared/CustomBreadcrumb';
import React from 'react';
import BlogSlider from '@/components/Blog/BlogSlider';
import BlogsSection from '@/components/Blog/BlogsSection';
import blogService from '@/services/blog.service';
import { BlogItem, BlogsMeta } from '@/types/blog';
import { pageAlternates } from '@/lib/seo';

interface BlogPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ page?: string }>;
}

const META: Record<string, { title: string; description: string }> = {
  az: {
    title: 'Bloq — Sağlam qidalanma və restoran bələdçisi | Harada Oturaq',
    description:
      'Sağlam qidalar, zərərli qidalar, restoranda düzgün seçim və Bakı məkanları haqqında bələdçilər. Harada və nə yeməli olduğunu öyrən.',
  },
  en: {
    title: 'Blog — Healthy eating and restaurant guides | Harada Oturaq',
    description:
      'Guides on healthy foods, foods to avoid, ordering smart at restaurants and the best places in Baku. Learn where and what to eat.',
  },
  ru: {
    title: 'Блог — здоровое питание и гид по ресторанам | Harada Oturaq',
    description:
      'Гиды о полезных и вредных продуктах, правильном выборе в ресторане и лучших местах Баку. Узнайте, где и что поесть.',
  },
};

export async function generateMetadata({
  params,
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const { lang } = await params;
  const { page } = await searchParams;
  const pageNum = Number(page) || 1;
  const t = META[lang] ?? META.en;

  return {
    title: { absolute: pageNum > 1 ? `${t.title} — ${pageNum}` : t.title },
    description: t.description,
    alternates: pageAlternates(lang, '/blog'),
    // Paginated pages carry no unique content: keep them out of the index but
    // let crawlers follow through to the individual posts.
    ...(pageNum > 1 ? { robots: { index: false, follow: true } } : {}),
  };
}

const BREADCRUMB: Record<string, { home: string; blog: string }> = {
  az: { home: 'Ana səhifə', blog: 'Bloq' },
  en: { home: 'Home', blog: 'Blog' },
  ru: { home: 'Главная', blog: 'Блог' },
};

const INTRO: Record<string, { h1: string; text: string }> = {
  az: {
    h1: 'Sağlam qidalanma və restoran bələdçisi',
    text: 'Hansı qidalar faydalı, hansılar zərərlidir; restoranda menyudan necə düzgün seçim etməli; Bakının hansı məkanları nə ilə seçilir — hamısı bir yerdə.',
  },
  en: {
    h1: 'Healthy eating and restaurant guide',
    text: 'Which foods help you and which harm you, how to order well at a restaurant, and what makes each place in Baku worth a visit — all in one place.',
  },
  ru: {
    h1: 'Здоровое питание и гид по ресторанам',
    text: 'Какие продукты полезны, а какие вредны, как правильно выбирать в меню ресторана и чем хороши заведения Баку — всё в одном месте.',
  },
};

const BlogPage = async ({ params, searchParams }: BlogPageProps) => {
  const { lang } = await params;
  const { page } = await searchParams;
  const pageNum = Math.max(1, Number(page) || 1);
  const t = BREADCRUMB[lang] ?? BREADCRUMB.en;

  const blogBreadCrumbItems = [
    { label: t.home, href: `/${lang}` },
    { label: t.blog },
  ];

  // Fetched here (server side) rather than in the child components, so the
  // posts are present in the initial HTML for crawlers.
  const listing = await blogService
    .getBlogs(pageNum, lang)
    .catch(() => null);

  const blogs: BlogItem[] = listing?.data ?? [];
  const meta: BlogsMeta | undefined = listing?.meta;

  // The hero highlights the newest posts and only belongs on the first page.
  const featured: BlogItem[] =
    pageNum === 1
      ? await blogService
          .getLatestBlogs(lang)
          .then((res) => res.data ?? [])
          .catch(() => [])
      : [];

  const intro = INTRO[lang] ?? INTRO.en;

  return (
    <>
      <CustomBreadCrumb items={blogBreadCrumbItems} />

      <section>
        <div className="wrapper pt-2">
          <h1 className="text-[28px] lg:text-[38px] font-bold text-gray-900 leading-tight">
            {intro.h1}
          </h1>
          <p className="mt-3 max-w-[720px] text-gray-600">{intro.text}</p>
        </div>
      </section>

      {featured.length > 0 && <BlogSlider lang={lang} blogs={featured} />}
      <BlogsSection lang={lang} blogs={blogs} meta={meta} />
    </>
  );
};

export default BlogPage;
