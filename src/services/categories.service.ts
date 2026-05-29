import apiClient from '@/api';
import { CategoriesResponse } from '@/types/category';

const categoriesService = {
  getCategories: () =>
    apiClient.get<CategoriesResponse>(`/categories`),
};

export default categoriesService;
