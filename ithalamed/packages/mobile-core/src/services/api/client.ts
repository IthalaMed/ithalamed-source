import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';

import { ApiConfig } from '../../config/api.config';
import { STORAGE_KEYS } from '../../config/storage.keys';

export interface TokenStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value:  string): Promise<void>;
  deleteItem(key: string): Promise<void>;
}

export interface AuthEventCallbacks {
  onTokenRefreshed?: (accessToken: string, refreshToken: string) => void;
  onTokenRefreshFailed?: () => void;
  onUnauthorized?: () => void;
}

export interface ApiClientConfig {
  apiConfig: ApiConfig;
  tokenStorage: TokenStorage;
  callbacks?: AuthEventCallbacks;
}

export class ApiClient {
  private client: AxiosInstance;
  private tokenStorage: TokenStorage;
  private callbacks: AuthEventCallbacks;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?:  unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  constructor(config:  ApiClientConfig) {
    this.tokenStorage = config.tokenStorage;
    this.callbacks = config.callbacks || {};

    this.client = axios.create({
      baseURL: config. apiConfig.baseURL,
      timeout: config.apiConfig.timeout,
      headers: config.apiConfig.headers,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client. interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        try {
          const token = await this.tokenStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
          if (token && config.headers) {
            config. headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('[ApiClient] Error getting access token:', error);
        }
        return config;
      },
      (error:  AxiosError) => Promise.reject(error),
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?:  boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(() => this.client(originalRequest))
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = await this.tokenStorage. getItem(STORAGE_KEYS.REFRESH_TOKEN);

            if (! refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await axios.post(
              `${this.client.defaults.baseURL}/auth/refresh`,
              { refreshToken },
            );

            const tokens = response.data. tokens || response.data;
            const { accessToken, refreshToken: newRefreshToken } = tokens;

            await this.tokenStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
            await this.tokenStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

            this.callbacks.onTokenRefreshed?.(accessToken, newRefreshToken);
            this.processQueue(null);

            if (originalRequest.headers) {
              originalRequest.headers. Authorization = `Bearer ${accessToken}`;
            }

            return this.client(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError);
            await this.clearTokens();
            this.callbacks.onTokenRefreshFailed?.();
            this.callbacks.onUnauthorized?.();
            return Promise.reject(refreshError);
          } finally {
            this. isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private processQueue(error: unknown): void {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve();
      }
    });
    this.failedQueue = [];
  }

  private async clearTokens(): Promise<void> {
    await this. tokenStorage.deleteItem(STORAGE_KEYS.ACCESS_TOKEN);
    await this.tokenStorage. deleteItem(STORAGE_KEYS.REFRESH_TOKEN);
    await this.tokenStorage.deleteItem(STORAGE_KEYS.USER_ID);
    await this.tokenStorage.deleteItem(STORAGE_KEYS.SESSION_ID);
  }

  setBaseURL(baseURL: string): void {
    this.client.defaults. baseURL = baseURL;
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client. post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client. put<T>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown): Promise<T> {
    const response = await this. client.patch<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
}

let apiClientInstance: ApiClient | null = null;

export function initializeApiClient(config: ApiClientConfig): ApiClient {
  apiClientInstance = new ApiClient(config);
  return apiClientInstance;
}

export function getApiClient(): ApiClient {
  if (!apiClientInstance) {
    throw new Error('API Client not initialized.  Call initializeApiClient() first.');
  }
  return apiClientInstance;
}
