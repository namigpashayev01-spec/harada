import apiClient from '@/api';
import { authStorage } from '@/lib/authStorage';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface Impression {
  id: number;
  title: string;
}

export interface ImpressionsResponse {
  data: Impression[];
}

export interface FeedbackPayload {
  restoran_id: number;
  rate: number;
  recommed_friends: 0 | 1;
  impression_id: number | null;
  galleries: File[];
  name: string;
  surname: string;
  comment: string;
}

export interface RatingDistribution {
  rate: number;
  count: number;
  percentage: number;
}

export interface FeedbackStatistics {
  average_rate: number;
  total_feedbacks: number;
  rating_distribution: RatingDistribution[];
}

export interface FeedbackItem {
  id: number;
  profile?: string | null;
  name: string;
  surname: string;
  rate: string;
  comment: string | null;
  images?: string[];
}

export interface FeedbackListResponse {
  statistics: FeedbackStatistics;
  feedbacks: FeedbackItem[];
}

const feedbackService = {
  getImpressions: () =>
    apiClient.get<ImpressionsResponse>('/impressions'),

  getFeedbackList: (slug: string) =>
    apiClient.get<FeedbackListResponse>(`/restoran-feedback-list/${slug}`),

  create: async (payload: FeedbackPayload) => {
    const form = new FormData();
    form.append('restoran_id', String(payload.restoran_id));
    form.append('rate', String(payload.rate));
    form.append('recommed_friends', String(payload.recommed_friends));
    if (payload.impression_id !== null) form.append('impression_id', String(payload.impression_id));
    payload.galleries.forEach((file) => form.append('galleries[]', file));
    form.append('name', payload.name);
    form.append('surname', payload.surname);
    if (payload.comment) form.append('comment', payload.comment);
    const token = authStorage.getAccessToken();
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${BASE_URL}/restoran-feedback`, {
      method: 'POST',
      headers,
      body: form,
    });
    return res.json();
  },
};

export default feedbackService;
