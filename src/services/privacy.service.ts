import apiClient from '@/api';

export interface PrivacyTranslation {
  title: string | null;
  content: string | null;
  seo_title: string | null;
  seo_description: string | null;
}

export interface PrivacyPageResponse {
  data: {
    // Keyed by locale (az/en/ru); an empty array when nothing is saved yet.
    translations: Record<string, PrivacyTranslation> | [];
    updated_at: string | null;
  };
}

const privacyService = {
  getPrivacyPage: () => apiClient.get<PrivacyPageResponse>('/privacy-page'),
};

export default privacyService;
