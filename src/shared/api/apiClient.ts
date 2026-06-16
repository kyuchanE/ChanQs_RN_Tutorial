import axios, {
  AxiosHeaders,
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import { runtimeConfig } from '../../app/config';
import {
  deleteTokenPair,
  getAccessToken,
  getRefreshToken,
  saveTokenPair,
  type StoredTokenPair,
} from '../storage';
import type { Nullable } from '../types';

const API_TIMEOUT_MS = 10_000;

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface QueuedRefreshRequest {
  readonly resolve: (tokenPair: StoredTokenPair) => void;
  readonly reject: (error: unknown) => void;
}

export interface AuthInterceptorDependencies {
  readonly getAccessToken: () => Promise<Nullable<string>>;
  readonly getRefreshToken: () => Promise<Nullable<string>>;
  readonly saveTokenPair: (tokenPair: StoredTokenPair) => Promise<void>;
  readonly clearTokenPair: () => Promise<void>;
  readonly refreshToken: (refreshToken: string) => Promise<StoredTokenPair>;
  readonly onLogout: () => Promise<void>;
}

const createConfiguredApiClient = (): AxiosInstance =>
  axios.create({
    baseURL: runtimeConfig.apiUrl,
    timeout: API_TIMEOUT_MS,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

export const publicApiClient = createConfiguredApiClient();

export const apiClient = createConfiguredApiClient();

let authInterceptorDependencies: AuthInterceptorDependencies = {
  getAccessToken,
  getRefreshToken,
  saveTokenPair,
  clearTokenPair: deleteTokenPair,
  refreshToken: async (): Promise<StoredTokenPair> => {
    throw new Error('Auth refresh handler is not configured.');
  },
  onLogout: deleteTokenPair,
};

let refreshPromise: Promise<StoredTokenPair> | null = null;

let refreshQueue: QueuedRefreshRequest[] = [];

export const configureAuthInterceptorDependencies = (
  dependencies: Partial<AuthInterceptorDependencies>,
): void => {
  authInterceptorDependencies = {
    ...authInterceptorDependencies,
    ...dependencies,
  };
};

const applyAuthorizationHeader = (
  config: InternalAxiosRequestConfig,
  accessToken: string,
): InternalAxiosRequestConfig => {
  const headers = AxiosHeaders.from(config.headers);

  headers.set('Authorization', `Bearer ${accessToken}`);
  config.headers = headers;

  return config;
};

const isUnauthorizedResponse = (
  error: AxiosError,
): error is AxiosError & { readonly config: RetryableRequestConfig } => {
  const config = error.config as RetryableRequestConfig | undefined;

  return (
    error.response?.status === 401 &&
    config !== undefined &&
    config._retry !== true
  );
};

const enqueueRefreshRequest = (): Promise<StoredTokenPair> =>
  new Promise<StoredTokenPair>((resolve, reject) => {
    refreshQueue = [...refreshQueue, { resolve, reject }];
  });

const resolveRefreshQueue = (tokenPair: StoredTokenPair): void => {
  refreshQueue.forEach((request) => {
    request.resolve(tokenPair);
  });
  refreshQueue = [];
};

const rejectRefreshQueue = (error: unknown): void => {
  refreshQueue.forEach((request) => {
    request.reject(error);
  });
  refreshQueue = [];
};

const refreshTokenOnce = async (
  refreshToken: string,
): Promise<StoredTokenPair> => {
  if (refreshPromise !== null) {
    return enqueueRefreshRequest();
  }

  refreshPromise = authInterceptorDependencies.refreshToken(refreshToken);

  try {
    const tokenPair = await refreshPromise;

    await authInterceptorDependencies.saveTokenPair(tokenPair);
    resolveRefreshQueue(tokenPair);

    return tokenPair;
  } catch (error) {
    rejectRefreshQueue(error);
    throw error;
  } finally {
    refreshPromise = null;
  }
};

const handleLogout = async (): Promise<void> => {
  await authInterceptorDependencies.clearTokenPair();
  await authInterceptorDependencies.onLogout();
};

apiClient.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    const accessToken = await authInterceptorDependencies.getAccessToken();

    return accessToken === null
      ? config
      : applyAuthorizationHeader(config, accessToken);
  },
);

apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: unknown): Promise<AxiosResponse> => {
    if (!axios.isAxiosError(error) || !isUnauthorizedResponse(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    originalRequest._retry = true;

    const refreshToken =
      await authInterceptorDependencies.getRefreshToken();

    if (refreshToken === null) {
      await handleLogout();

      return Promise.reject(error);
    }

    try {
      const tokenPair = await refreshTokenOnce(refreshToken);

      applyAuthorizationHeader(originalRequest, tokenPair.accessToken);

      return apiClient.request(originalRequest);
    } catch (refreshError) {
      await handleLogout();

      return Promise.reject(refreshError);
    }
  },
);
