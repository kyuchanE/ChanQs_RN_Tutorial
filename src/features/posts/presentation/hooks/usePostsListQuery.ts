import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getPostsUseCase } from '../../data';
import type { PostListItem } from '../../domain';
import { PostsDomainException } from '../../domain';
import { mapPostsQueryError } from './postsQueryError';
import { postsQueryKeys } from './postsQueryKeys';

const POSTS_LIST_STALE_TIME_MS = 60_000;

export const usePostsListQuery = (): UseQueryResult<
  readonly PostListItem[],
  PostsDomainException
> =>
  useQuery<readonly PostListItem[], PostsDomainException>({
    queryKey: postsQueryKeys.all,
    queryFn: async (): Promise<readonly PostListItem[]> => {
      try {
        return await getPostsUseCase.execute();
      } catch (error) {
        throw mapPostsQueryError(error);
      }
    },
    staleTime: POSTS_LIST_STALE_TIME_MS,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
