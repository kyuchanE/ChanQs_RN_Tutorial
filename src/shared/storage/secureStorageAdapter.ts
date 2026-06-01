import * as SecureStore from 'expo-secure-store';

import type { Nullable } from '../types';
import type { SecureStorageAdapter } from './storageAdapters';
import type { SecureStorageKey } from './storageKeys';

const assertSecureStoreAvailable = async (): Promise<void> => {
  const isAvailable = await SecureStore.isAvailableAsync();

  if (!isAvailable) {
    throw new Error('SecureStore is not available on this platform.');
  }
};

export const secureStorageAdapter: SecureStorageAdapter = {
  getString: async (key: SecureStorageKey): Promise<Nullable<string>> => {
    await assertSecureStoreAvailable();

    return SecureStore.getItemAsync(key);
  },

  setString: async (
    key: SecureStorageKey,
    value: string,
  ): Promise<void> => {
    await assertSecureStoreAvailable();
    await SecureStore.setItemAsync(key, value);
  },

  removeItem: async (key: SecureStorageKey): Promise<void> => {
    await assertSecureStoreAvailable();
    await SecureStore.deleteItemAsync(key);
  },

  isAvailable: SecureStore.isAvailableAsync,
};

