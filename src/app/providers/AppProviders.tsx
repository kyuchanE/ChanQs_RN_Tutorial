import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppBootstrapProvider } from './AppBootstrapProvider';
import { queryClient } from './queryClient';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AppBootstrapProvider>{children}</AppBootstrapProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

