import apiClient from '@/api';
import { BlogDetailResponse, BlogsResponse, SimilarBlogsResponse } from '@/types/blog';

const blogService = {
  getBlogs: (page = 1) =>
    apiClient.get<BlogsResponse>(`/blogs?page=${page}`),

  getBlog: (slug: string) =>
    apiClient.get<BlogDetailResponse>(`/blogs/${slug}`),

  getSimilarBlogs: (slug: string) =>
    apiClient.get<SimilarBlogsResponse>(`/similar-blogs/${slug}`),

  getLatestBlogs: () =>
    apiClient.get<SimilarBlogsResponse>(`/latest-blogs`),
};

export default blogService;
