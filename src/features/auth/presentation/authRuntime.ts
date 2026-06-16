import { configureAuthInterceptorDependencies } from '../../../shared/api';
import { refreshTokenUseCase } from '../data';
import { clearAuthenticatedSession } from './services/authSessionService';

let isAuthRuntimeConfigured = false;

export const configureAuthRuntime = (): void => {
  if (isAuthRuntimeConfigured) {
    return;
  }

  configureAuthInterceptorDependencies({
    refreshToken: (refreshToken: string) =>
      refreshTokenUseCase.execute(refreshToken),
    onLogout: clearAuthenticatedSession,
  });

  isAuthRuntimeConfigured = true;
};
