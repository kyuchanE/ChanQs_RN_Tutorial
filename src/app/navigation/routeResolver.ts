import type { PushNotificationPayload } from '../../shared/notifications';
import type { DeepLinkPath, ParsedDeepLink } from '../../shared/types';
import {
  LOGIN_OR_MY_PAGE_ROUTES,
  MAIN_TAB_ROUTES,
  POSTS_ROUTES,
  ROOT_STACK_ROUTES,
} from './routeNames';
import type { RootStackParamList } from './navigationTypes';

export const POST_DETAIL_PATH_PREFIX = 'posts';

export const FALLBACK_POST_ID = 1;

export interface PostDetailRouteIntent {
  readonly type: 'postDetail';
  readonly postId: number;
  readonly requiresAuth: false;
}

export interface AccountRouteIntent {
  readonly type: 'account';
  readonly requiresAuth: true;
}

export interface MainTabsRouteIntent {
  readonly type: 'mainTabs';
  readonly requiresAuth: false;
}

export type AppRouteIntent =
  | PostDetailRouteIntent
  | AccountRouteIntent
  | MainTabsRouteIntent;

export type RootNavigationParams = RootStackParamList[
  typeof ROOT_STACK_ROUTES.MAIN_TABS
];

export const parsePostId = (value: string | number | undefined): number | null => {
  const numericValue =
    typeof value === 'number' ? value : Number.parseInt(value ?? '', 10);

  return Number.isInteger(numericValue) && numericValue > 0
    ? numericValue
    : null;
};

export const parsePostIdOrFallback = (
  value: string | number | undefined,
): number => parsePostId(value) ?? FALLBACK_POST_ID;

export const createPostDetailPath = (postId: number): DeepLinkPath =>
  `${POST_DETAIL_PATH_PREFIX}/${parsePostIdOrFallback(postId)}`;

export const parseDeepLinkPath = (path: string): ParsedDeepLink => {
  const [prefix, rawPostId] = path.replace(/^\/+/, '').split('/');

  if (prefix !== POST_DETAIL_PATH_PREFIX) {
    return null;
  }

  const postId = parsePostId(rawPostId);

  return postId === null
    ? null
    : {
        type: 'postDetail',
        postId,
      };
};

export const resolveDeepLinkRoute = (path: string): AppRouteIntent => {
  const normalizedPath = path.replace(/^\/+/, '').replace(/\/+$/, '');

  if (normalizedPath === 'account/my-page') {
    return { type: 'account', requiresAuth: true };
  }

  const parsedPath = parseDeepLinkPath(path);

  return parsedPath === null
    ? { type: 'mainTabs', requiresAuth: false }
    : {
        type: 'postDetail',
        postId: parsedPath.postId,
        requiresAuth: false,
      };
};

export const resolveNotificationRoute = (
  payload: PushNotificationPayload,
): AppRouteIntent => {
  if (payload.path !== undefined) {
    return resolveDeepLinkRoute(payload.path);
  }

  if (payload.type === 'postDetail') {
    const postId = parsePostId(payload.postId);

    return postId === null
      ? { type: 'mainTabs', requiresAuth: false }
      : {
          type: 'postDetail',
          postId,
          requiresAuth: false,
        };
  }

  return { type: 'mainTabs', requiresAuth: false };
};

export const isAuthRequiredRouteName = (routeName: string): boolean =>
  routeName === LOGIN_OR_MY_PAGE_ROUTES.MY_PAGE;

export const resolveUnauthenticatedRedirect = (
  intent: AppRouteIntent,
): RootNavigationParams =>
  intent.requiresAuth
    ? {
        screen: MAIN_TAB_ROUTES.LOGIN_OR_MY_PAGE_STACK,
        params: {
          screen: LOGIN_OR_MY_PAGE_ROUTES.LOGIN,
        },
      }
    : undefined;

export const resolveRouteIntentToRootParams = (
  intent: AppRouteIntent,
): RootNavigationParams => {
  if (intent.type === 'postDetail') {
    return {
      screen: MAIN_TAB_ROUTES.POSTS_STACK,
      params: {
        screen: POSTS_ROUTES.DETAIL,
        params: {
          id: intent.postId,
        },
      },
    };
  }

  if (intent.type === 'account') {
    return {
      screen: MAIN_TAB_ROUTES.LOGIN_OR_MY_PAGE_STACK,
      params: {
        screen: LOGIN_OR_MY_PAGE_ROUTES.MY_PAGE,
      },
    };
  }

  return undefined;
};
