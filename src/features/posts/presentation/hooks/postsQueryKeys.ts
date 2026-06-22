import { QUERY_KEYS } from '../../../../shared/api';
import type { PostId } from '../../domain';

export const postsQueryKeys = {
  all: QUERY_KEYS.posts.all,
  detail: (id: PostId) => QUERY_KEYS.posts.detail(id),
} as const;
