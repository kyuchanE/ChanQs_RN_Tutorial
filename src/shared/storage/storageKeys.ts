export const SECURE_STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth.accessToken',
  REFRESH_TOKEN: 'auth.refreshToken',
} as const;

export const ASYNC_STORAGE_KEYS = {
  ONBOARDING_COMPLETED: 'app.onboardingCompleted',
  THEME: 'preferences.theme',
  LANGUAGE: 'preferences.language',
  RECENT_SEARCHES: 'search.recentSearches',
} as const;

export type SecureStorageKey =
  (typeof SECURE_STORAGE_KEYS)[keyof typeof SECURE_STORAGE_KEYS];

export type AsyncStorageKey =
  (typeof ASYNC_STORAGE_KEYS)[keyof typeof ASYNC_STORAGE_KEYS];

export type StorageKey = SecureStorageKey | AsyncStorageKey;

