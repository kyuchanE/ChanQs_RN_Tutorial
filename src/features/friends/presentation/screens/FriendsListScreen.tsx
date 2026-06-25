import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  type ListRenderItemInfo,
} from 'react-native';

import type { FriendsStackParamList } from '../../../../app/navigation/navigationTypes';
import { FRIENDS_ROUTES } from '../../../../app/navigation/routeNames';
import {
  EmptyState,
  ErrorState,
  ListSeparator,
  LoadingState,
  ScreenContainer,
} from '../../../../shared/components';
import type { Friend } from '../../domain';
import { FriendListItem } from '../components';
import { useFriendsListQuery } from '../hooks';

type FriendsListScreenProps = NativeStackScreenProps<
  FriendsStackParamList,
  typeof FRIENDS_ROUTES.LIST
>;

export function FriendsListScreen(_props: FriendsListScreenProps) {
  const { data, error, isError, isPending, isRefetching, refetch } =
    useFriendsListQuery();

  const friends = data ?? [];

  const handleRetry = useCallback((): void => {
    void refetch();
  }, [refetch]);

  const renderFriend = useCallback(
    ({ item }: ListRenderItemInfo<Friend>) => <FriendListItem friend={item} />,
    [],
  );

  const keyExtractor = useCallback(
    (item: Friend): string => item.id.toString(),
    [],
  );

  if (isPending) {
    return (
      <ScreenContainer>
        <LoadingState
          title="친구 목록을 불러오는 중"
          description="잠시만 기다려 주세요."
        />
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer>
        <ErrorState message={error.message} onRetry={handleRetry} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer contentStyle={styles.container}>
      <Text style={styles.title}>친구목록</Text>
      <FlatList
        data={friends}
        renderItem={renderFriend}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ListSeparator}
        contentContainerStyle={styles.listContent}
        refreshing={isRefetching}
        onRefresh={handleRetry}
        ListEmptyComponent={
          <EmptyState
            title="친구가 없습니다"
            description="조회 가능한 친구 정보가 없어요."
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  listContent: {
    flexGrow: 1,
  },
});
