import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  type ListRenderItemInfo,
} from 'react-native';

import { navigateToPostDetail } from '../../../../app/navigation/navigationHelpers';
import type { PostsStackParamList } from '../../../../app/navigation/navigationTypes';
import { POSTS_ROUTES } from '../../../../app/navigation/routeNames';
import {
  EmptyState,
  ErrorState,
  ListSeparator,
  LoadingState,
  ScreenContainer,
} from '../../../../shared/components';
import type { PostId, PostListItem as PostListItemModel } from '../../domain';
import { PostListItem } from '../components';
import { usePostsListQuery } from '../hooks';

type PostsListScreenProps = NativeStackScreenProps<
  PostsStackParamList,
  typeof POSTS_ROUTES.LIST
>;

export function PostsListScreen({ navigation }: PostsListScreenProps) {
  const { data, error, isError, isPending, isRefetching, refetch } =
    usePostsListQuery();

  const posts = data ?? [];

  const handlePressPost = useCallback(
    (id: PostId): void => {
      navigateToPostDetail(navigation, id);
    },
    [navigation],
  );

  const handleRetry = useCallback((): void => {
    void refetch();
  }, [refetch]);

  const renderPost = useCallback(
    ({ item }: ListRenderItemInfo<PostListItemModel>) => (
      <PostListItem post={item} onPress={handlePressPost} />
    ),
    [handlePressPost],
  );

  const keyExtractor = useCallback(
    (item: PostListItemModel): string => item.id.toString(),
    [],
  );

  if (isPending) {
    return (
      <ScreenContainer>
        <LoadingState
          title="게시글을 불러오는 중"
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
      <Text style={styles.title}>게시글목록</Text>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ListSeparator}
        contentContainerStyle={styles.listContent}
        refreshing={isRefetching}
        onRefresh={handleRetry}
        ListEmptyComponent={
          <EmptyState
            title="게시글이 없습니다"
            description="조회 가능한 게시글이 없어요."
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
