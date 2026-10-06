import apiClient from '@/api';
import { BlogDetailResponse, BlogsResponse, SimilarBlogsResponse } from '@/types/blog';

// `lang` must be passed from server components (pages, generateMetadata,
// sitemap): the shared apiClient default set by setLang() only reflects the
// browser's language, so without it the API falls back to `az` and every
// locale gets Azerbaijani content.
const langHeader = (lang?: string) =>
  lang ? { headers: { 'Accept-Language': lang } } : undefined;

const blogService = {
  getBlogs: (page = 1, lang?: string) =>
    apiClient.get<BlogsResponse>(`/blogs?page=${page}`, langHeader(lang)),

  getBlog: (slug: string, lang?: string) =>
    apiClient.get<BlogDetailResponse>(`/blogs/${slug}`, langHeader(lang)),

  getSimilarBlogs: (slug: string, lang?: string) =>
    apiClient.get<SimilarBlogsResponse>(`/similar-blogs/${slug}`, langHeader(lang)),

  getLatestBlogs: (lang?: string) =>
    apiClient.get<SimilarBlogsResponse>(`/latest-blogs`, langHeader(lang)),
};

export default blogService;
