import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { authStorage } from '@/lib/authStorage';

interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

type RetryableRequest = AxiosRequestConfig & { _retry?: boolean };

class ApiClient {
  private client: AxiosInstance;
  private refreshing: Promise<string | null> | null = null;
  private onAuthFailed: (() => void) | null = null;

  constructor(config: ApiClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    this.client.interceptors.request.use((req) => {
      if (req.data instanceof FormData) {
        req.headers = req.headers ?? {};
        delete (req.headers as Record<string, string>)['Content-Type'];
      }
      const token = authStorage.getAccessToken();
      if (token && !req.headers?.Authorization) {
        req.headers = req.headers ?? {};
        (req.headers as Record<string, string>).Authorization = `Bearer ${token}`;
      }
      return req;
    });

    this.client.interceptors.response.use(
      (res) => res,
      async (error: AxiosError) => {
        const original = error.config as RetryableRequest | undefined;
        const status = error.response?.status;
        const isAuthEndpoint =
          typeof original?.url === 'string' &&
          (original.url.includes('/refresh-token') ||
            original.url.includes('/login') ||
            original.url.includes('/register'));

        if (status === 401 && original && !original._retry && !isAuthEndpoint) {
          original._retry = true;
          try {
            const newToken = await this.refreshAccessToken();
            if (newToken) {
              original.headers = original.headers ?? {};
              (original.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
              return this.client.request(original);
            }
          } catch {
            // fall through to reject
          }
          authStorage.clear();
          this.onAuthFailed?.();
        }
        return Promise.reject(error);
      },
    );
  }

  private refreshAccessToken(): Promise<string | null> {
    if (this.refreshing) return this.refreshing;
    const refresh = authStorage.getRefreshToken();
    if (!refresh) return Promise.resolve(null);

    const form = new FormData();
    form.append('token', refresh);

    this.refreshing = axios
      .post(`${this.client.defaults.baseURL}/refresh-token`, form)
      .then((res) => {
        const data = res.data ?? {};
        const access =
          data.access_token || data.token || data.accessToken || data.data?.access_token || null;
        const newRefresh =
          data.refresh_token || data.refreshToken || data.data?.refresh_token || undefined;
        if (access) {
          authStorage.setTokens(access, newRefresh);
          return access as string;
        }
        return null;
      })
      .catch(() => null)
      .finally(() => {
        this.refreshing = null;
      });

    return this.refreshing;
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.request(config);
    return response.data;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T, D = Record<string, unknown>>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T, D = Record<string, unknown>>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async patch<T, D = Record<string, unknown>>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  setLang(lang: string) {
    this.client.defaults.headers.common['Accept-Language'] = lang;
  }

  setAuthFailedHandler(handler: (() => void) | null) {
    this.onAuthFailed = handler;
  }
}

const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
});

export default apiClient;
