import { QueryClient } from '@tanstack/react-query';

import { isNumber, isRecord } from '../../shared/utils';

export const DEFAULT_QUERY_STALE_TIME_MS = 60 * 1000;

export const DEFAULT_QUERY_RETRY_COUNT = 1;

const NON_RETRYABLE_HTTP_STATUSES = [401, 403, 404] as const;

const getHttpStatus = (error: unknown): number | undefined => {
  if (!isRecord(error)) {
    return undefined;
  }

  const response = error.response;

  if (!isRecord(response)) {
    return undefined;
  }

  const status = response.status;

  return isNumber(status) ? status : undefined;
};

export const shouldRetryQuery = (
  failureCount: number,
  error: unknown,
): boolean => {
  const status = getHttpStatus(error);

  if (
    status !== undefined &&
    NON_RETRYABLE_HTTP_STATUSES.some(
      (nonRetryableStatus) => nonRetryableStatus === status,
    )
  ) {
    return false;
  }

  return failureCount < DEFAULT_QUERY_RETRY_COUNT;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_QUERY_STALE_TIME_MS,
      retry: shouldRetryQuery,
      refetchOnReconnect: true,
    },
  },
});

export const clearQueryCache = async (
  client: QueryClient = queryClient,
): Promise<void> => {
  await client.cancelQueries();
  client.clear();
};

