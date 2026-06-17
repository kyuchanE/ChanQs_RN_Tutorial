import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { PostsStackParamList } from './navigationTypes';
import { POSTS_ROUTES } from './routeNames';

export type PostsListNavigation = NativeStackNavigationProp<
  PostsStackParamList,
  typeof POSTS_ROUTES.LIST
>;

export const navigateToPostDetail = (
  navigation: PostsListNavigation,
  id: number,
): void => {
  navigation.navigate(POSTS_ROUTES.DETAIL, { id });
};
