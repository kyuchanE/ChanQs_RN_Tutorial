import { create } from 'zustand';

import type {
  AuthError,
  AuthState,
  AuthUser,
  TokenPair,
} from '../../domain';

export interface SetAuthenticatedPayload {
  readonly user: AuthUser | null;
  readonly tokenPair: TokenPair;
}

export interface AuthStoreActions {
  readonly setAuthenticated: (payload: SetAuthenticatedPayload) => void;
  readonly setUnauthenticated: (error?: AuthError) => void;
  readonly setRestoring: () => void;
  readonly setProfile: (user: AuthUser) => void;
  readonly clearAuth: () => void;
}

export type AuthStore = AuthState & AuthStoreActions;

export const initialAuthState: AuthState = {
  status: 'restoring',
  user: null,
  tokenPair: null,
  error: null,
};

const unauthenticatedAuthState: AuthState = {
  ...initialAuthState,
  status: 'unauthenticated',
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialAuthState,

  setAuthenticated: (payload: SetAuthenticatedPayload): void => {
    set({
      status: 'authenticated',
      user: payload.user,
      tokenPair: payload.tokenPair,
      error: null,
    });
  },

  setUnauthenticated: (error?: AuthError): void => {
    set({
      ...unauthenticatedAuthState,
      error: error ?? null,
    });
  },

  setRestoring: (): void => {
    set(initialAuthState);
  },

  setProfile: (user: AuthUser): void => {
    set((state) =>
      state.status === 'authenticated'
        ? {
            ...state,
            user,
            error: null,
          }
        : state,
    );
  },

  clearAuth: (): void => {
    set(unauthenticatedAuthState);
  },
}));

export const selectAuthStatus = (state: AuthStore): AuthStore['status'] =>
  state.status;

export const selectAuthUser = (state: AuthStore): AuthStore['user'] =>
  state.user;

export const selectAuthTokenPair = (
  state: AuthStore,
): AuthStore['tokenPair'] => state.tokenPair;

export const selectIsAuthenticated = (state: AuthStore): boolean =>
  state.status === 'authenticated' && state.tokenPair !== null;

export const selectAuthError = (state: AuthStore): AuthStore['error'] =>
  state.error;
