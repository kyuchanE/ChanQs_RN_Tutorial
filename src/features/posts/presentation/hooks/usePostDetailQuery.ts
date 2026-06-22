import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getPostDetailUseCase } from '../../data';
import type { Post, PostId } from '../../domain';
import { PostsDomainException } from '../../domain';
import { mapPostsQueryError } from './postsQueryError';
import { postsQueryKeys } from './postsQueryKeys';

const POST_DETAIL_STALE_TIME_MS = 120_000;

export const usePostDetailQuery = (
  id: PostId,
): UseQueryResult<Post, PostsDomainException> =>
  useQuery<Post, PostsDomainException>({
    queryKey: postsQueryKeys.detail(id),
    queryFn: async (): Promise<Post> => {
      try {
        return await getPostDetailUseCase.execute(id);
      } catch (error) {
        throw mapPostsQueryError(error);
      }
    },
    staleTime: POST_DETAIL_STALE_TIME_MS,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
