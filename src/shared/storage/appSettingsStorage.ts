import type { Nullable } from '../types';
import { isBoolean, isString } from '../utils';
import { asyncStorageAdapter } from './asyncStorageAdapter';
import { ASYNC_STORAGE_KEYS } from './storageKeys';

export type ThemePreference = 'light' | 'dark' | 'system';

export type LanguagePreference = 'ko' | 'en' | 'system';

const THEME_PREFERENCES = ['light', 'dark', 'system'] as const;

const LANGUAGE_PREFERENCES = ['ko', 'en', 'system'] as const;

const isThemePreference = (value: Nullable<string>): value is ThemePreference =>
  value !== null &&
  THEME_PREFERENCES.some((themePreference) => themePreference === value);

const isLanguagePreference = (
  value: Nullable<string>,
): value is LanguagePreference =>
  value !== null &&
  LANGUAGE_PREFERENCES.some(
    (languagePreference) => languagePreference === value,
  );

const isStringArray = (value: unknown): value is readonly string[] =>
  Array.isArray(value) && value.every(isString);

export const saveOnboardingCompleted = async (
  completed: boolean,
): Promise<void> => {
  await asyncStorageAdapter.setJson(
    ASYNC_STORAGE_KEYS.ONBOARDING_COMPLETED,
    completed,
  );
};

export const getOnboardingCompleted = async (): Promise<
  Nullable<boolean>
> => {
  const completed = await asyncStorageAdapter.getJson<unknown>(
    ASYNC_STORAGE_KEYS.ONBOARDING_COMPLETED,
  );

  return isBoolean(completed) ? completed : null;
};

export const saveThemePreference = async (
  theme: ThemePreference,
): Promise<void> => {
  await asyncStorageAdapter.setString(ASYNC_STORAGE_KEYS.THEME, theme);
};

export const getThemePreference = async (): Promise<
  Nullable<ThemePreference>
> => {
  const theme = await asyncStorageAdapter.getString(ASYNC_STORAGE_KEYS.THEME);

  return isThemePreference(theme) ? theme : null;
};

export const saveLanguagePreference = async (
  language: LanguagePreference,
): Promise<void> => {
  await asyncStorageAdapter.setString(ASYNC_STORAGE_KEYS.LANGUAGE, language);
};

export const getLanguagePreference = async (): Promise<
  Nullable<LanguagePreference>
> => {
  const language = await asyncStorageAdapter.getString(
    ASYNC_STORAGE_KEYS.LANGUAGE,
  );

  return isLanguagePreference(language) ? language : null;
};

export const saveRecentSearches = async (
  recentSearches: readonly string[],
): Promise<void> => {
  await asyncStorageAdapter.setJson(
    ASYNC_STORAGE_KEYS.RECENT_SEARCHES,
    recentSearches,
  );
};

export const getRecentSearches = async (): Promise<
  Nullable<readonly string[]>
> => {
  const recentSearches = await asyncStorageAdapter.getJson<unknown>(
    ASYNC_STORAGE_KEYS.RECENT_SEARCHES,
  );

  return isStringArray(recentSearches) ? recentSearches : null;
};

export const deleteAppSetting = async (
  key: keyof typeof ASYNC_STORAGE_KEYS,
): Promise<void> => {
  await asyncStorageAdapter.removeItem(ASYNC_STORAGE_KEYS[key]);
};
