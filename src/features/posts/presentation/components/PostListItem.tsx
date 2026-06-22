import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { PostId, PostListItem as PostListItemModel } from '../../domain';

export interface PostListItemProps {
  readonly post: PostListItemModel;
  readonly onPress: (id: PostId) => void;
}

const formatPostMeta = (post: PostListItemModel): string => {
  const authorLabel =
    post.authorId === null ? '작성자 정보 없음' : `작성자 ${post.authorId}`;

  return post.createdAt === null
    ? authorLabel
    : `${authorLabel} · ${post.createdAt}`;
};

export function PostListItem({ post, onPress }: PostListItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        onPress(post.id);
      }}
      style={({ pressed }) => [
        styles.container,
        pressed ? styles.containerPressed : null,
      ]}
    >
      <View style={styles.textContainer}>
        <Text numberOfLines={2} style={styles.title}>
          {post.title}
        </Text>
        <Text numberOfLines={3} style={styles.excerpt}>
          {post.excerpt}
        </Text>
        <Text numberOfLines={1} style={styles.meta}>
          {formatPostMeta(post)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  containerPressed: {
    opacity: 0.7,
  },
  textContainer: {
    gap: 8,
  },
  title: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '700',
    color: '#111827',
  },
  excerpt: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4b5563',
  },
  meta: {
    fontSize: 12,
    color: '#6b7280',
  },
});
