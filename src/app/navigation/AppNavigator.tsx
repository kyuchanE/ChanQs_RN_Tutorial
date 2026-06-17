import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  LoginScreen,
  MyPageScreen,
} from '../../features/auth/presentation/screens';
import { FriendsListScreen } from '../../features/friends/presentation/screens';
import {
  PostDetailScreen,
  PostsListScreen,
} from '../../features/posts/presentation/screens';
import {
  selectIsAuthenticated,
  useAuthStore,
} from '../../features/auth/presentation/store/authStore';
import { linkingConfig } from './linking';
import type {
  AuthStackParamList,
  FriendsStackParamList,
  LoginOrMyPageStackParamList,
  MainTabParamList,
  PostsStackParamList,
  RootStackParamList,
} from './navigationTypes';
import {
  AUTH_ROUTES,
  FRIENDS_ROUTES,
  LOGIN_OR_MY_PAGE_ROUTES,
  MAIN_TAB_ROUTES,
  POSTS_ROUTES,
  ROOT_STACK_ROUTES,
} from './routeNames';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const LoginOrMyPageStack =
  createNativeStackNavigator<LoginOrMyPageStackParamList>();

const PostsStack = createNativeStackNavigator<PostsStackParamList>();

const FriendsStack = createNativeStackNavigator<FriendsStackParamList>();

const MainTab = createBottomTabNavigator<MainTabParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer linking={linkingConfig}>
      <RootStack.Navigator
        initialRouteName={ROOT_STACK_ROUTES.MAIN_TABS}
        screenOptions={{ headerShown: false }}
      >
        <RootStack.Screen
          name={ROOT_STACK_ROUTES.AUTH_FLOW}
          component={AuthFlowNavigator}
        />
        <RootStack.Screen
          name={ROOT_STACK_ROUTES.MAIN_TABS}
          component={MainTabsNavigator}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

function AuthFlowNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name={AUTH_ROUTES.LOGIN}
        component={LoginScreen}
        options={{ title: '로그인' }}
      />
    </AuthStack.Navigator>
  );
}

function MainTabsNavigator() {
  return (
    <MainTab.Navigator screenOptions={{ headerShown: false }}>
      <MainTab.Screen
        name={MAIN_TAB_ROUTES.LOGIN_OR_MY_PAGE_STACK}
        component={LoginOrMyPageStackNavigator}
        options={{ tabBarLabel: '로그인/마이페이지', title: '로그인/마이페이지' }}
      />
      <MainTab.Screen
        name={MAIN_TAB_ROUTES.POSTS_STACK}
        component={PostsStackNavigator}
        options={{ tabBarLabel: '게시글목록', title: '게시글목록' }}
      />
      <MainTab.Screen
        name={MAIN_TAB_ROUTES.FRIENDS_STACK}
        component={FriendsStackNavigator}
        options={{ tabBarLabel: '친구목록', title: '친구목록' }}
      />
    </MainTab.Navigator>
  );
}

function LoginOrMyPageStackNavigator() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  return (
    <LoginOrMyPageStack.Navigator>
      {isAuthenticated ? (
        <LoginOrMyPageStack.Screen
          name={LOGIN_OR_MY_PAGE_ROUTES.MY_PAGE}
          component={MyPageScreen}
          options={{ title: '마이페이지' }}
        />
      ) : (
        <LoginOrMyPageStack.Screen
          name={LOGIN_OR_MY_PAGE_ROUTES.LOGIN}
          component={LoginScreen}
          options={{ title: '로그인' }}
        />
      )}
    </LoginOrMyPageStack.Navigator>
  );
}

function PostsStackNavigator() {
  return (
    <PostsStack.Navigator>
      <PostsStack.Screen
        name={POSTS_ROUTES.LIST}
        component={PostsListScreen}
        options={{ title: '게시글목록' }}
      />
      <PostsStack.Screen
        name={POSTS_ROUTES.DETAIL}
        component={PostDetailScreen}
        options={{ title: '게시글상세' }}
      />
    </PostsStack.Navigator>
  );
}

function FriendsStackNavigator() {
  return (
    <FriendsStack.Navigator>
      <FriendsStack.Screen
        name={FRIENDS_ROUTES.LIST}
        component={FriendsListScreen}
        options={{ title: '친구목록' }}
      />
    </FriendsStack.Navigator>
  );
}
