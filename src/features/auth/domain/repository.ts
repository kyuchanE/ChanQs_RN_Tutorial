import type { Nullable } from '../../../shared/types';
import type { AuthSession, AuthUser, LoginCredentials, TokenPair } from './entities';

export interface AuthRepository {
  readonly login: (credentials: LoginCredentials) => Promise<AuthSession>;
  readonly logout: () => Promise<void>;
  readonly restoreToken: () => Promise<Nullable<TokenPair>>;
  readonly refreshToken: (refreshToken: string) => Promise<TokenPair>;
  readonly getProfile: () => Promise<AuthUser>;
}
