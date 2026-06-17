import type { NavigatorScreenParams } from '@react-navigation/native';

import {
  AUTH_ROUTES,
  FRIENDS_ROUTES,
  LOGIN_OR_MY_PAGE_ROUTES,
  MAIN_TAB_ROUTES,
  POSTS_ROUTES,
  ROOT_STACK_ROUTES,
} from './routeNames';

export type AuthStackParamList = {
  [AUTH_ROUTES.LOGIN]: undefined;
};

export type LoginOrMyPageStackParamList = {
  [LOGIN_OR_MY_PAGE_ROUTES.LOGIN]: undefined;
  [LOGIN_OR_MY_PAGE_ROUTES.MY_PAGE]: undefined;
};

export type PostsStackParamList = {
  [POSTS_ROUTES.LIST]: undefined;
  [POSTS_ROUTES.DETAIL]: {
    readonly id: number;
  };
};

export type FriendsStackParamList = {
  [FRIENDS_ROUTES.LIST]: undefined;
};

export type MainTabParamList = {
  [MAIN_TAB_ROUTES.LOGIN_OR_MY_PAGE_STACK]:
    | NavigatorScreenParams<LoginOrMyPageStackParamList>
    | undefined;
  [MAIN_TAB_ROUTES.POSTS_STACK]:
    | NavigatorScreenParams<PostsStackParamList>
    | undefined;
  [MAIN_TAB_ROUTES.FRIENDS_STACK]:
    | NavigatorScreenParams<FriendsStackParamList>
    | undefined;
};

export type RootStackParamList = {
  [ROOT_STACK_ROUTES.AUTH_FLOW]:
    | NavigatorScreenParams<AuthStackParamList>
    | undefined;
  [ROOT_STACK_ROUTES.MAIN_TABS]:
    | NavigatorScreenParams<MainTabParamList>
    | undefined;
};
