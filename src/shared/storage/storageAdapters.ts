import type { Nullable } from '../types';
import type { AsyncStorageKey, SecureStorageKey } from './storageKeys';

export interface AsyncStorageAdapter {
  readonly getString: (key: AsyncStorageKey) => Promise<Nullable<string>>;
  readonly setString: (key: AsyncStorageKey, value: string) => Promise<void>;
  readonly getJson: <TValue>(key: AsyncStorageKey) => Promise<Nullable<TValue>>;
  readonly setJson: <TValue>(
    key: AsyncStorageKey,
    value: TValue,
  ) => Promise<void>;
  readonly removeItem: (key: AsyncStorageKey) => Promise<void>;
}

export interface SecureStorageAdapter {
  readonly getString: (key: SecureStorageKey) => Promise<Nullable<string>>;
  readonly setString: (key: SecureStorageKey, value: string) => Promise<void>;
  readonly removeItem: (key: SecureStorageKey) => Promise<void>;
  readonly isAvailable: () => Promise<boolean>;
}

