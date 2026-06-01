import type { Nullable } from '../types';
import { SECURE_STORAGE_KEYS } from './storageKeys';
import { secureStorageAdapter } from './secureStorageAdapter';

export interface StoredTokenPair {
  readonly accessToken: string;
  readonly refreshToken: string;
}

export const saveAccessToken = async (accessToken: string): Promise<void> => {
  await secureStorageAdapter.setString(
    SECURE_STORAGE_KEYS.ACCESS_TOKEN,
    accessToken,
  );
};

export const getAccessToken = async (): Promise<Nullable<string>> =>
  secureStorageAdapter.getString(SECURE_STORAGE_KEYS.ACCESS_TOKEN);

export const deleteAccessToken = async (): Promise<void> => {
  await secureStorageAdapter.removeItem(SECURE_STORAGE_KEYS.ACCESS_TOKEN);
};

export const saveRefreshToken = async (refreshToken: string): Promise<void> => {
  await secureStorageAdapter.setString(
    SECURE_STORAGE_KEYS.REFRESH_TOKEN,
    refreshToken,
  );
};

export const getRefreshToken = async (): Promise<Nullable<string>> =>
  secureStorageAdapter.getString(SECURE_STORAGE_KEYS.REFRESH_TOKEN);

export const deleteRefreshToken = async (): Promise<void> => {
  await secureStorageAdapter.removeItem(SECURE_STORAGE_KEYS.REFRESH_TOKEN);
};

export const saveTokenPair = async ({
  accessToken,
  refreshToken,
}: StoredTokenPair): Promise<void> => {
  await Promise.all([
    saveAccessToken(accessToken),
    saveRefreshToken(refreshToken),
  ]);
};

export const deleteTokenPair = async (): Promise<void> => {
  await Promise.all([deleteAccessToken(), deleteRefreshToken()]);
};

