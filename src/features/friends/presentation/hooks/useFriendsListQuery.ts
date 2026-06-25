import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getFriendsUseCase } from '../../data';
import type { Friend } from '../../domain';
import { FriendsDomainException } from '../../domain';
import { mapFriendsQueryError } from './friendsQueryError';
import { friendsQueryKeys } from './friendsQueryKeys';

const FRIENDS_LIST_STALE_TIME_MS = 60_000;

export const useFriendsListQuery = (): UseQueryResult<
  readonly Friend[],
  FriendsDomainException
> =>
  useQuery<readonly Friend[], FriendsDomainException>({
    queryKey: friendsQueryKeys.all,
    queryFn: async (): Promise<readonly Friend[]> => {
      try {
        return await getFriendsUseCase.execute();
      } catch (error) {
        throw mapFriendsQueryError(error);
      }
    },
    staleTime: FRIENDS_LIST_STALE_TIME_MS,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
