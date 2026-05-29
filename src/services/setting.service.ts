import apiClient from '@/api';
import { SettingResponse } from '@/types';

const settingService = {
  getSettings: () => apiClient.get<SettingResponse>('/setting'),
};

export default settingService;
