import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { PostsStackParamList } from '../../../../app/navigation/navigationTypes';
import { POSTS_ROUTES } from '../../../../app/navigation/routeNames';

type PostDetailScreenProps = NativeStackScreenProps<
  PostsStackParamList,
  typeof POSTS_ROUTES.DETAIL
>;

export function PostDetailScreen({ route }: PostDetailScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>게시글상세</Text>
        <Text style={styles.description}>ID {route.params.id}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
  },
});
