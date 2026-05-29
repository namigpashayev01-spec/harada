import apiClient from '@/api';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  image?: string | null;
  phone?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthTokens {
  access_token?: string;
  refresh_token?: string;
  token?: string;
}

export interface AuthResponse extends AuthTokens {
  user?: AuthUser;
  data?: AuthUser | AuthTokens;
  message?: string;
}

const toForm = (data: Record<string, unknown>) => {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    form.append(key, value instanceof Blob ? value : String(value));
  });
  return form;
};

const authService = {
  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse, FormData>('/register', toForm({ ...payload })),

  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse, FormData>('/login', toForm({ ...payload })),

  refresh: (token: string) =>
    apiClient.post<AuthResponse, FormData>('/refresh-token', toForm({ token })),

  logout: () => apiClient.post<{ message?: string }>('/logout'),
};

export default authService;
