import apiClient from '@/api';
import { SettingResponse } from '@/types';

const settingService = {
  // Short timeout: this runs during SSR (metadata) and must not block the page.
  getSettings: () =>
    apiClient.get<SettingResponse>('/setting', { timeout: 2500 }),
};

export default settingService;
