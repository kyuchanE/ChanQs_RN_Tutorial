import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { PostsStackParamList } from '../../../../app/navigation/navigationTypes';
import { POSTS_ROUTES } from '../../../../app/navigation/routeNames';
import {
  ErrorState,
  LoadingState,
  ScreenContainer,
} from '../../../../shared/components';
import { usePostDetailQuery } from '../hooks';

type PostDetailScreenProps = NativeStackScreenProps<
  PostsStackParamList,
  typeof POSTS_ROUTES.DETAIL
>;

export function PostDetailScreen({ route }: PostDetailScreenProps) {
  const { id } = route.params;
  const { data: post, error, isError, isPending, refetch } =
    usePostDetailQuery(id);

  const handleRetry = useCallback((): void => {
    void refetch();
  }, [refetch]);

  if (isPending) {
    return (
      <ScreenContainer>
        <LoadingState
          title="게시글 상세를 불러오는 중"
          description={`게시글 ${id}번을 조회하고 있습니다.`}
        />
      </ScreenContainer>
    );
  }

  if (isError || post === undefined) {
    return (
      <ScreenContainer>
        <ErrorState
          message={error?.message ?? '게시글 상세를 불러오지 못했습니다.'}
          onRetry={handleRetry}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer contentStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>게시글상세</Text>
        <Text style={styles.meta}>ID {post.id}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.content}>{post.content}</Text>
        <Text style={styles.meta}>
          {post.authorId === null ? '작성자 정보 없음' : `작성자 ${post.authorId}`}
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  header: {
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  contentContainer: {
    gap: 14,
  },
  postTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
  meta: {
    fontSize: 13,
    color: '#4b5563',
  },
});
