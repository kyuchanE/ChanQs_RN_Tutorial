export const QUERY_KEYS = {
  auth: {
    profile: ['auth', 'profile'] as const,
  },
  posts: {
    all: ['posts'] as const,
    detail: (id: number) => ['posts', id] as const,
  },
  friends: {
    all: ['friends'] as const,
  },
} as const;

export type PostsListQueryKey = typeof QUERY_KEYS.posts.all;

export type PostDetailQueryKey = ReturnType<typeof QUERY_KEYS.posts.detail>;

export type FriendsListQueryKey = typeof QUERY_KEYS.friends.all;

export type AuthProfileQueryKey = typeof QUERY_KEYS.auth.profile;

