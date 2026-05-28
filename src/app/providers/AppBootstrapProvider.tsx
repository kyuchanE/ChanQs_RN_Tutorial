import type { PropsWithChildren } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type BootstrapStatus = 'loading' | 'ready' | 'error';

type BootstrapPhase = 'tokenRestore' | 'criticalConfig';

interface BootstrapState {
  readonly status: BootstrapStatus;
  readonly phase: BootstrapPhase;
  readonly errorMessage?: string;
}

interface BootstrapLoadingViewProps {
  readonly phase: BootstrapPhase;
}

interface BootstrapErrorFallbackProps {
  readonly message: string;
  readonly onRetry: () => void;
}

const loadingMessageByPhase: Record<BootstrapPhase, string> = {
  tokenRestore: '인증 상태를 확인하는 중입니다.',
  criticalConfig: '앱 설정을 불러오는 중입니다.',
};

const restoreStoredTokens = async (): Promise<void> => {
  await Promise.resolve();
};

const loadCriticalConfig = async (): Promise<void> => {
  await Promise.resolve();
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return '앱 초기화에 실패했습니다.';
};

export function AppBootstrapProvider({ children }: PropsWithChildren) {
  const [retryCount, setRetryCount] = useState(0);
  const [state, setState] = useState<BootstrapState>({
    status: 'loading',
    phase: 'tokenRestore',
  });

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async (): Promise<void> => {
      try {
        setState({ status: 'loading', phase: 'tokenRestore' });
        await restoreStoredTokens();

        if (!isMounted) {
          return;
        }

        setState({ status: 'loading', phase: 'criticalConfig' });
        await loadCriticalConfig();

        if (!isMounted) {
          return;
        }

        setState({ status: 'ready', phase: 'criticalConfig' });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setState({
          status: 'error',
          phase: 'criticalConfig',
          errorMessage: getErrorMessage(error),
        });
      }
    };

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, [retryCount]);

  const handleRetry = useCallback(() => {
    setRetryCount((currentRetryCount) => currentRetryCount + 1);
  }, []);

  if (state.status === 'loading') {
    return <BootstrapLoadingView phase={state.phase} />;
  }

  if (state.status === 'error') {
    return (
      <BootstrapErrorFallback
        message={state.errorMessage ?? '앱 초기화에 실패했습니다.'}
        onRetry={handleRetry}
      />
    );
  }

  return <>{children}</>;
}

function BootstrapLoadingView({ phase }: BootstrapLoadingViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>준비 중</Text>
      <Text style={styles.description}>{loadingMessageByPhase[phase]}</Text>
    </View>
  );
}

function BootstrapErrorFallback({
  message,
  onRetry,
}: BootstrapErrorFallbackProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>초기화 실패</Text>
      <Text style={styles.description}>{message}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onRetry}
        style={({ pressed }) => [
          styles.retryButton,
          pressed ? styles.retryButtonPressed : null,
        ]}
      >
        <Text style={styles.retryButtonText}>다시 시도</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: '#4b5563',
  },
  retryButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#2563eb',
  },
  retryButtonPressed: {
    opacity: 0.82,
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});

