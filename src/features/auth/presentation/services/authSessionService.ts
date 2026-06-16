import { clearQueryCache } from '../../../../app/providers/queryClient';
import { logoutUseCase } from '../../data';
import { useAuthStore } from '../store/authStore';

export const clearAuthenticatedSession = async (): Promise<void> => {
  await logoutUseCase.execute();
  useAuthStore.getState().clearAuth();
  await clearQueryCache();
};
