import { getStateFromPath, type LinkingOptions } from '@react-navigation/native';

import { runtimeConfig } from '../config';
import {
  selectIsAuthenticated,
  useAuthStore,
} from '../../features/auth/presentation/store/authStore';
import type { RootStackParamList } from './navigationTypes';
import {
  AUTH_ROUTES,
  FRIENDS_ROUTES,
  LOGIN_OR_MY_PAGE_ROUTES,
  MAIN_TAB_ROUTES,
  POSTS_ROUTES,
  ROOT_STACK_ROUTES,
} from './routeNames';
import { parsePostIdOrFallback } from './routeResolver';
import { resolveDeepLinkRoute } from './routeResolver';

const loginPath = 'account/login';

export const linkingConfig: LinkingOptions<RootStackParamList> = {
  prefixes: [`${runtimeConfig.deepLinkScheme}://`],
  getStateFromPath(path, options) {
    const intent = resolveDeepLinkRoute(path);
    const isAuthenticated = selectIsAuthenticated(useAuthStore.getState());

    if (intent.requiresAuth && !isAuthenticated) {
      return getStateFromPath(loginPath, options);
    }

    return getStateFromPath(path, options);
  },
  config: {
    initialRouteName: ROOT_STACK_ROUTES.MAIN_TABS,
    screens: {
      [ROOT_STACK_ROUTES.AUTH_FLOW]: {
        path: 'auth',
        screens: {
          [AUTH_ROUTES.LOGIN]: 'login',
        },
      },
      [ROOT_STACK_ROUTES.MAIN_TABS]: {
        screens: {
          [MAIN_TAB_ROUTES.LOGIN_OR_MY_PAGE_STACK]: {
            path: 'account',
            screens: {
              [LOGIN_OR_MY_PAGE_ROUTES.LOGIN]: 'login',
              [LOGIN_OR_MY_PAGE_ROUTES.MY_PAGE]: 'my-page',
            },
          },
          [MAIN_TAB_ROUTES.POSTS_STACK]: {
            screens: {
              [POSTS_ROUTES.LIST]: 'posts',
              [POSTS_ROUTES.DETAIL]: {
                path: 'posts/:id',
                parse: {
                  id: parsePostIdOrFallback,
                },
              },
            },
          },
          [MAIN_TAB_ROUTES.FRIENDS_STACK]: {
            path: 'friends',
            screens: {
              [FRIENDS_ROUTES.LIST]: '',
            },
          },
        },
      },
    },
  },
};
