import { useQuery } from '@tanstack/react-query';
   import categoriesService from '@/services/categories.service';

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getCategories(),
  });
