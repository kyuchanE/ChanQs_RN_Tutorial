import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Nullable } from '../types';
import type { AsyncStorageAdapter } from './storageAdapters';
import type { AsyncStorageKey } from './storageKeys';

const parseJson = <TValue>(value: string): TValue => {
  const parsed: unknown = JSON.parse(value);

  return parsed as TValue;
};

export const asyncStorageAdapter: AsyncStorageAdapter = {
  getString: async (key: AsyncStorageKey): Promise<Nullable<string>> =>
    AsyncStorage.getItem(key),

  setString: async (key: AsyncStorageKey, value: string): Promise<void> => {
    await AsyncStorage.setItem(key, value);
  },

  getJson: async <TValue>(
    key: AsyncStorageKey,
  ): Promise<Nullable<TValue>> => {
    const value = await AsyncStorage.getItem(key);

    return value === null ? null : parseJson<TValue>(value);
  },

  setJson: async <TValue>(
    key: AsyncStorageKey,
    value: TValue,
  ): Promise<void> => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  removeItem: async (key: AsyncStorageKey): Promise<void> => {
    await AsyncStorage.removeItem(key);
  },
};

