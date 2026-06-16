import type { Nullable } from '../../../shared/types';
import {
  deleteTokenPair,
  getAccessToken,
  getRefreshToken,
  saveTokenPair,
} from '../../../shared/storage';
import type { TokenPair } from '../domain';

export interface AuthLocalDataSource {
  readonly saveTokenPair: (tokenPair: TokenPair) => Promise<void>;
  readonly getTokenPair: () => Promise<Nullable<TokenPair>>;
  readonly getAccessToken: () => Promise<Nullable<string>>;
  readonly getRefreshToken: () => Promise<Nullable<string>>;
  readonly clearTokenPair: () => Promise<void>;
}

export class SecureAuthLocalDataSource implements AuthLocalDataSource {
  async saveTokenPair(tokenPair: TokenPair): Promise<void> {
    await saveTokenPair(tokenPair);
  }

  async getTokenPair(): Promise<Nullable<TokenPair>> {
    const [accessToken, refreshToken] = await Promise.all([
      getAccessToken(),
      getRefreshToken(),
    ]);

    if (accessToken === null || refreshToken === null) {
      return null;
    }

    return { accessToken, refreshToken };
  }

  getAccessToken(): Promise<Nullable<string>> {
    return getAccessToken();
  }

  getRefreshToken(): Promise<Nullable<string>> {
    return getRefreshToken();
  }

  async clearTokenPair(): Promise<void> {
    await deleteTokenPair();
  }
}
