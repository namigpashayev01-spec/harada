import apiClient from '@/api';
import { AuthUser } from './auth.service';
import { FeedbackItem } from './feedback.service';

export interface UserResponse {
  data?: AuthUser;
  user?: AuthUser;
}

export interface UserFeedbackItem extends FeedbackItem {
  restoran_id?: number;
  restoran_title?: string;
  profile?: string | null;
  galleries?: string[];
  images?: string[];
  created_at?: string;
}

export interface UserFeedbacksResponse {
  data?: UserFeedbackItem[];
  feedbacks?: UserFeedbackItem[];
}

export interface FavoriteRestaurant {
  id: number;
  title: string;
  slug?: { az: string; en: string; ru: string };
  image: string;
  address?: string;
  categories?: { id: number; title: string }[];
}

export interface FavoritesResponse {
  data?: FavoriteRestaurant[];
  favorites?: FavoriteRestaurant[];
}

export interface ChangeProfilePayload {
  name?: string;
  email?: string;
  image?: File | null;
}

const userService = {
  getProfile: () => apiClient.post<UserResponse>('/user'),

  changeProfile: (payload: ChangeProfilePayload) => {
    const form = new FormData();
    if (payload.name !== undefined) form.append('name', payload.name);
    if (payload.email !== undefined) form.append('email', payload.email);
    if (payload.image) form.append('image', payload.image);
    return apiClient.post<UserResponse, FormData>('/user/changeProfile', form);
  },

  deleteImage: () =>
    apiClient.post<{ message?: string }>('/user/deleteImage'),

  getFeedbacks: () => apiClient.get<UserFeedbacksResponse>('/user/feedbacks'),

  getFavorites: () => apiClient.get<FavoritesResponse>('/user/favorites'),

  addFavorite: (restoranId: number) => {
    const form = new FormData();
    form.append('restoran_id', String(restoranId));
    return apiClient.post<{ message?: string }, FormData>(
      '/user/favorites/add',
      form,
    );
  },

  removeFavorite: (restoranId: number) => {
    const form = new FormData();
    form.append('restoran_id', String(restoranId));
    return apiClient.post<{ message?: string }, FormData>(
      '/user/favorites/delete',
      form,
    );
  },
};

export default userService;
