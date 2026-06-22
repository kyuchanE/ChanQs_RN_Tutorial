import type { Post, PostId, PostListItem } from './entities';

export interface PostsRepository {
  readonly getPosts: () => Promise<readonly PostListItem[]>;
  readonly getPostDetail: (id: PostId) => Promise<Post>;
}
