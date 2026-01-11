import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';

import { getApiConfig } from '../../config/api.config';
import { STORAGE_KEYS } from '../../config/storage.keys';

const tokenStorage = {
  getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  },
  setItem(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  },
  deleteItem(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
};

function createApiClient(): AxiosInstance {
  const config = getApiConfig();

  const client = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout,
    headers: config.headers,
  });

  client.  interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = tokenStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error:  AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?:  boolean;
      };

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = tokenStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

          if (! refreshToken) {
            throw new Error('No refresh token');
          }

          const response = await axios.post(`${config.baseURL}/auth/refresh`, { refreshToken });

          const { accessToken, refreshToken: newRefreshToken } =
            response.data. tokens || response.data;

          tokenStorage. setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          tokenStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

          if (originalRequest. headers) {
            originalRequest. headers.Authorization = `Bearer ${accessToken}`;
          }

          return client(originalRequest);
        } catch (refreshError) {
          tokenStorage.deleteItem(STORAGE_KEYS.ACCESS_TOKEN);
          tokenStorage.deleteItem(STORAGE_KEYS. REFRESH_TOKEN);
          tokenStorage.deleteItem(STORAGE_KEYS.USER_ID);

          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );

  return client;
}

let apiClientInstance: AxiosInstance | null = null;

export function getApiClient(): AxiosInstance {
  if (!apiClientInstance) {
    apiClientInstance = createApiClient();
  }
  return apiClientInstance;
}

export const api = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    getApiClient()
      .get<T>(url, { params })
      .then((res) => res.data),

  post: <T>(url:  string, data?: unknown) =>
    getApiClient()
      .post<T>(url, data)
      .then((res) => res.data),

  put: <T>(url: string, data?: unknown) =>
    getApiClient()
      .put<T>(url, data)
      .then((res) => res.data),

  patch: <T>(url: string, data?: unknown) =>
    getApiClient()
      .patch<T>(url, data)
      .then((res) => res.data),

  delete: <T>(url: string) =>
    getApiClient()
      .delete<T>(url)
      .then((res) => res.data),
};

export { tokenStorage, STORAGE_KEYS };
