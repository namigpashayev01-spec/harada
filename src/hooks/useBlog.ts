import { useQuery } from '@tanstack/react-query';
import blogService from '@/services/blog.service';

export const useBlog = (slug: string) =>
  useQuery({
    queryKey: ['blog', slug],
    queryFn: () => blogService.getBlog(slug),
    enabled: !!slug,
  });
