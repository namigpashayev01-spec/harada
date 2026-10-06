import apiClient from '@/api';

export type SlotStatus = 'available' | 'full' | 'blocked' | 'past';

export interface AvailabilityHour {
  time: string;
  status: SlotStatus;
  remaining: number | null;
}

export interface AvailabilityMeal {
  type: 'breakfast' | 'lunch' | 'dinner';
  hours: AvailabilityHour[];
  available_count: number;
}

export interface AvailabilityResponse {
  date: string;
  reservation_enabled: boolean;
  capacity: number | null;
  whole_day_blocked: boolean;
  block_reason: string | null;
  meals: AvailabilityMeal[];
}

export interface ReservationPayload {
  restoran_id: number;
  date: string;
  time_slot: string;
  time: string;
  guest_count: number;
  guest_names: string;
  phone: string;
}

export interface UserReservation {
  id: number;
  title?: string;
  restoran_image?: string;
  restoran_address?: string;
  map_link?: string;
  open_from?: string;
  date?: string;
  time?: string;
  time_slot?: string;
  guest_count?: number;
  booking_id?: string | null;
  reservation_date?: string;
  status?: string;
  status_color?: string;
  menus?: { id: number; title: string; images: string[] }[];
}

export interface UserReservationsResponse {
  data?: UserReservation[];
  reservations?: UserReservation[];
}

const reservationService = {
  create: (payload: ReservationPayload) => {
    const body = new URLSearchParams();
    body.append('restoran_id', String(payload.restoran_id));
    body.append('date', payload.date);
    body.append('time_slot', payload.time_slot);
    body.append('time', payload.time);
    body.append('guest_count', String(payload.guest_count));
    body.append('guest_names', payload.guest_names);
    body.append('phone', payload.phone);
    return apiClient.post('/reservation', body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },

  /** Seçilmiş gün üçün hansı saatların boş/dolu/bağlı olduğu. */
  getAvailability: (restoranId: number | string, date: string) =>
    apiClient.get<AvailabilityResponse>(
      `/restoran/${restoranId}/availability?date=${date}`,
    ),

  getMyReservations: () =>
    apiClient.get<UserReservationsResponse>('/user/reservations'),

  cancel: (reservationId: number) => {
    const body = new URLSearchParams();
    body.append('reservation_id', String(reservationId));
    return apiClient.post('/user/cancel/reservation', body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
};

export default reservationService;
