export type AuthErrorKind =
  | 'invalidCredentials'
  | 'tokenMissing'
  | 'tokenExpired'
  | 'network'
  | 'unknown';

export interface AuthError {
  readonly kind: AuthErrorKind;
  readonly message: string;
  readonly cause?: unknown;
}
