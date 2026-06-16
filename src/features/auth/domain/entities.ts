import type { Nullable } from '../../../shared/types';

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly profileImageUrl: Nullable<string>;
}

export interface TokenPair {
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export interface AuthSession {
  readonly user: AuthUser;
  readonly tokenPair: TokenPair;
}
