import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { navigateToPostDetail } from '../../../../app/navigation/navigationHelpers';
import type { PostsStackParamList } from '../../../../app/navigation/navigationTypes';
import { POSTS_ROUTES } from '../../../../app/navigation/routeNames';

type PostsListScreenProps = NativeStackScreenProps<
  PostsStackParamList,
  typeof POSTS_ROUTES.LIST
>;

export function PostsListScreen({ navigation }: PostsListScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>게시글목록</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            navigateToPostDetail(navigation, 1);
          }}
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonPressed : null,
          ]}
        >
          <Text style={styles.buttonText}>게시글 1</Text>
        </Pressable>
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
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  button: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#2563eb',
  },
  buttonPressed: {
    opacity: 0.82,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});
