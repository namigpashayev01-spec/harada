import apiClient from '@/api';
import { SocialLinksResponse } from '@/types';

const socialLinkService = {
  getSocialLinks: () =>
    apiClient.get<SocialLinksResponse>(`/social-links`),
};

export default socialLinkService;
