import apiClient from '@/api';
import { PropertyResponse } from '@/types/restaurant';

const propertyService = {
  getProperties: () => apiClient.get<PropertyResponse>('/properties'),
};

export default propertyService;
