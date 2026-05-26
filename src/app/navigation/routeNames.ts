export const ROOT_STACK_ROUTES = {
  AUTH_FLOW: 'AuthFlow',
  MAIN_TABS: 'MainTabs',
} as const;

export const MAIN_TAB_ROUTES = {
  LOGIN_OR_MY_PAGE_STACK: 'LoginOrMyPageStack',
  POSTS_STACK: 'PostsStack',
  FRIENDS_STACK: 'FriendsStack',
} as const;

export const AUTH_ROUTES = {
  LOGIN: 'LoginScreen',
} as const;

export const LOGIN_OR_MY_PAGE_ROUTES = {
  LOGIN: 'LoginScreen',
  MY_PAGE: 'MyPageScreen',
} as const;

export const POSTS_ROUTES = {
  LIST: 'PostsListScreen',
  DETAIL: 'PostDetailScreen',
} as const;

export const FRIENDS_ROUTES = {
  LIST: 'FriendsListScreen',
} as const;

export type RootStackRouteName =
  (typeof ROOT_STACK_ROUTES)[keyof typeof ROOT_STACK_ROUTES];

export type MainTabRouteName =
  (typeof MAIN_TAB_ROUTES)[keyof typeof MAIN_TAB_ROUTES];

export type AuthRouteName = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];

export type LoginOrMyPageRouteName =
  (typeof LOGIN_OR_MY_PAGE_ROUTES)[keyof typeof LOGIN_OR_MY_PAGE_ROUTES];

export type PostsRouteName = (typeof POSTS_ROUTES)[keyof typeof POSTS_ROUTES];

export type FriendsRouteName =
  (typeof FRIENDS_ROUTES)[keyof typeof FRIENDS_ROUTES];

