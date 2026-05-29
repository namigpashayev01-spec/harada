import { useQuery } from '@tanstack/react-query';
import blogService from '@/services/blog.service';

export const useSimilarBlogs = (slug: string) =>
  useQuery({
    queryKey: ['similar-blogs', slug],
    queryFn: () => blogService.getSimilarBlogs(slug),
    enabled: !!slug,
  });
