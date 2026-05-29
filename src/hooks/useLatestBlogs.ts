import { useQuery } from '@tanstack/react-query';
import blogService from '@/services/blog.service';

export const useLatestBlogs = () =>
  useQuery({
    queryKey: ['latest-blogs'],
    queryFn: () => blogService.getLatestBlogs(),
  });
