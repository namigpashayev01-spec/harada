import apiClient from '@/api';

export interface ClaimableRestaurant {
  id: number;
  title: string;
  address: string | null;
  /** Bu restoranın artıq təsdiqlənmiş sahibi var. */
  claimed: boolean;
}

export interface OwnerApplication {
  id: number;
  restoran_id: number | null;
  title: string;
  is_new_restaurant: boolean;
  status: 0 | 1 | 2;
  status_label: string;
  reject_reason: string | null;
  created_at: string;
}

export interface OwnedRestaurant {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  status: number;
  reservation_enabled: boolean;
  reservation_capacity: number | null;
}

export interface ClaimPayload {
  restoran_id: number;
  contact_name: string;
  contact_phone: string;
  position?: string;
  message?: string;
}

export interface NewRestaurantPayload {
  name: string;
  contact_name: string;
  contact_phone: string;
  position?: string;
  message?: string;
  proposed?: Record<string, string | string[]>;
}

/** Obyekti Laravel-in gözlədiyi `proposed[key]=value` formasına çevirir. */
function appendProposed(body: URLSearchParams, proposed?: NewRestaurantPayload['proposed']) {
  if (!proposed) return;
  Object.entries(proposed).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      value.forEach((v) => body.append(`proposed[${key}][]`, v));
    } else {
      body.append(`proposed[${key}]`, value);
    }
  });
}

export interface OwnerReservation {
  id: number;
  booking_id: number | null;
  date: string;
  time: string | null;
  time_slot: string | null;
  guest_count: number;
  guest_names: string;
  phone: string;
  special_request: string | null;
  status: number;
  status_label: string;
  status_color: string;
  created_at: string;
}

export interface OwnerReservationsResponse {
  data: OwnerReservation[];
  meta: { current_page: number; last_page: number; total: number };
  counts: { pending: number; confirmed: number };
}

export type ReservationFilter = 'pending' | 'confirmed' | 'declined' | 'all';

export interface WorkingHourRow {
  day_of_week: string;
  breakfast_start: string | null;
  breakfast_end: string | null;
  breakfast_active: boolean;
  lunch_start: string | null;
  lunch_end: string | null;
  lunch_active: boolean;
  dinner_start: string | null;
  dinner_end: string | null;
  dinner_active: boolean;
}

export interface SlotBlock {
  id: number;
  date: string;
  time: string | null;
  whole_day: boolean;
  reason: string | null;
}

export interface MenuDishRow {
  id: number;
  sort: number;
  price: string | null;
  name: string | null;
  description: string | null;
}

export interface MenuCategoryRow {
  id: number;
  sort: number;
  name: string | null;
  dishes: MenuDishRow[];
}

export interface PendingChange {
  id: number;
  field: string;
  new_value: string;
  locale: string | null;
  created_at: string;
}

export interface OwnerSettings {
  id: number;
  reservation_enabled: boolean;
  reservation_capacity: number | null;
  phone: string | null;
  whatsapp: string | null;
  website: string | null;
  average_price: string | null;
  latitude: string | null;
  longitude: string | null;
  translations: Record<string, { title: string; address: string; description: string }>;
  pending_changes: PendingChange[];
}

export interface OwnerReview {
  id: number;
  name: string;
  rate: number;
  comment: string | null;
  impressions: string[];
  created_at: string;
  published: boolean;
}

export interface OwnerPhoto {
  id: number;
  url: string;
  path: string;
  approved: boolean;
  is_cover: boolean;
  created_at: string;
}

export interface OwnerPhotosResponse {
  cover: string | null;
  cover_path: string | null;
  data: OwnerPhoto[];
  limit: number;
}

const ownerService = {
  searchClaimable: (search: string) =>
    apiClient.get<{ data: ClaimableRestaurant[] }>(
      `/owner/claimable?search=${encodeURIComponent(search)}`,
    ),

  claim: (payload: ClaimPayload) => {
    const body = new URLSearchParams();
    body.append('restoran_id', String(payload.restoran_id));
    body.append('contact_name', payload.contact_name);
    body.append('contact_phone', payload.contact_phone);
    if (payload.position) body.append('position', payload.position);
    if (payload.message) body.append('message', payload.message);
    return apiClient.post('/owner/apply', body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },

  registerRestaurant: (payload: NewRestaurantPayload) => {
    const body = new URLSearchParams();
    body.append('name', payload.name);
    body.append('contact_name', payload.contact_name);
    body.append('contact_phone', payload.contact_phone);
    if (payload.position) body.append('position', payload.position);
    if (payload.message) body.append('message', payload.message);
    appendProposed(body, payload.proposed);
    return apiClient.post('/owner/register-restaurant', body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },

  /** Yeni restoran müraciəti üçün şəkil yükləmə (restoran hələ yoxdur). */
  uploadRegistrationPhotos: (files: File[]) => {
    const form = new FormData();
    files.forEach((f) => form.append('photos[]', f));
    return apiClient.post<
      { data: { paths: string[]; urls: string[] } },
      FormData
    >('/owner/registration-photos', form);
  },

  getApplications: () =>
    apiClient.get<{ data: OwnerApplication[] }>('/owner/applications'),

  getRestaurants: () =>
    apiClient.get<{ data: OwnedRestaurant[] }>('/owner/restaurants'),

  getReservations: (restoranId: number, status: ReservationFilter = 'pending') =>
    apiClient.get<OwnerReservationsResponse>(
      `/owner/${restoranId}/reservations?status=${status}`,
    ),

  confirmReservation: (restoranId: number, reservationId: number) =>
    apiClient.post(`/owner/${restoranId}/reservations/${reservationId}/confirm`),

  // --- ayarlar ---
  getSettings: (restoranId: number) =>
    apiClient.get<OwnerSettings>(`/owner/${restoranId}/settings`),

  updateSettings: (restoranId: number, payload: Record<string, unknown>) =>
    apiClient.put(`/owner/${restoranId}/settings`, payload),

  requestChange: (
    restoranId: number,
    field: string,
    value: string,
    locale?: string,
  ) =>
    apiClient.post(`/owner/${restoranId}/change-request`, {
      field,
      value,
      ...(locale ? { locale } : {}),
    }),

  // --- iş saatları ---
  getHours: (restoranId: number) =>
    apiClient.get<{ data: WorkingHourRow[] }>(`/owner/${restoranId}/hours`),

  updateHours: (restoranId: number, hours: WorkingHourRow[]) =>
    apiClient.put(`/owner/${restoranId}/hours`, { hours }),

  // --- dolu saatlar ---
  getBlocks: (restoranId: number) =>
    apiClient.get<{ data: SlotBlock[] }>(`/owner/${restoranId}/blocks`),

  addBlock: (
    restoranId: number,
    payload: { date: string; times?: string[]; whole_day?: boolean; reason?: string },
  ) => apiClient.post(`/owner/${restoranId}/blocks`, payload),

  removeBlock: (restoranId: number, blockId: number) =>
    apiClient.delete(`/owner/${restoranId}/blocks/${blockId}`),

  // --- menyu ---
  getMenu: (restoranId: number, locale = 'az') =>
    apiClient.get<{ data: MenuCategoryRow[] }>(
      `/owner/${restoranId}/menu?locale=${locale}`,
    ),

  addCategory: (restoranId: number, name: Record<string, string>) =>
    apiClient.post(`/owner/${restoranId}/menu/categories`, { name }),

  updateCategory: (
    restoranId: number,
    categoryId: number,
    payload: { name?: Record<string, string>; sort?: number },
  ) => apiClient.put(`/owner/${restoranId}/menu/categories/${categoryId}`, payload),

  deleteCategory: (restoranId: number, categoryId: number) =>
    apiClient.delete(`/owner/${restoranId}/menu/categories/${categoryId}`),

  addDish: (
    restoranId: number,
    categoryId: number,
    payload: { name: Record<string, string>; description?: Record<string, string>; price?: string },
  ) =>
    apiClient.post(
      `/owner/${restoranId}/menu/categories/${categoryId}/dishes`,
      payload,
    ),

  updateDish: (
    restoranId: number,
    dishId: number,
    payload: {
      name?: Record<string, string>;
      description?: Record<string, string>;
      price?: string;
    },
  ) => apiClient.put(`/owner/${restoranId}/menu/dishes/${dishId}`, payload),

  deleteDish: (restoranId: number, dishId: number) =>
    apiClient.delete(`/owner/${restoranId}/menu/dishes/${dishId}`),

  // --- şəkillər ---
  getPhotos: (restoranId: number) =>
    apiClient.get<OwnerPhotosResponse>(`/owner/${restoranId}/photos`),

  uploadPhotos: (restoranId: number, files: File[]) => {
    const form = new FormData();
    files.forEach((f) => form.append('photos[]', f));
    return apiClient.post<{ message?: string }, FormData>(
      `/owner/${restoranId}/photos`,
      form,
    );
  },

  deletePhoto: (restoranId: number, photoId: number) =>
    apiClient.delete(`/owner/${restoranId}/photos/${photoId}`),

  setCover: (restoranId: number, photoId: number) =>
    apiClient.post(`/owner/${restoranId}/photos/${photoId}/cover`),

  // --- rəylər ---
  getReviews: (restoranId: number) =>
    apiClient.get<{ data: OwnerReview[]; average: number; total: number }>(
      `/owner/${restoranId}/reviews`,
    ),

  rejectReservation: (restoranId: number, reservationId: number, reason?: string) => {
    const body = new URLSearchParams();
    if (reason) body.append('reason', reason);
    return apiClient.post(
      `/owner/${restoranId}/reservations/${reservationId}/reject`,
      body,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
  },
};

export default ownerService;
