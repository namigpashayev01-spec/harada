import apiClient from '@/api';
import { SocialLinksResponse } from '@/types';

const socialLinkService = {
  // Short timeout: runs during SSR (footer) and must not block the page.
  getSocialLinks: () =>
    apiClient.get<SocialLinksResponse>(`/social-links`, { timeout: 2500 }),
};

export default socialLinkService;
