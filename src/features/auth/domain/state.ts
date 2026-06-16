import type { Nullable } from '../../../shared/types';
import type { AuthUser, TokenPair } from './entities';
import type { AuthError } from './errors';

export type AuthStatus = 'restoring' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  readonly status: AuthStatus;
  readonly user: Nullable<AuthUser>;
  readonly tokenPair: Nullable<TokenPair>;
  readonly error: Nullable<AuthError>;
}
