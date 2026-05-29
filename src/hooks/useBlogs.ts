import { useQuery } from '@tanstack/react-query';
import blogService from '@/services/blog.service';

export const useBlogs = (page = 1) =>
  useQuery({
    queryKey: ['blogs', page],
    queryFn: () => blogService.getBlogs(page),
  });
