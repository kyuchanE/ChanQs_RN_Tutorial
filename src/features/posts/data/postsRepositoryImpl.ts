import type { Post, PostId, PostListItem, PostsRepository } from '../domain';
import {
  mapPostDetailResponseDtoToPost,
  mapPostResponseDtoToPostListItem,
} from './postMapper';
import type { PostsRemoteDataSource } from './postsRemoteDataSource';

export class DefaultPostsRepository implements PostsRepository {
  constructor(private readonly remoteDataSource: PostsRemoteDataSource) {}

  async getPosts(): Promise<readonly PostListItem[]> {
    const response = await this.remoteDataSource.getPosts();

    return response.map(mapPostResponseDtoToPostListItem);
  }

  async getPostDetail(id: PostId): Promise<Post> {
    const response = await this.remoteDataSource.getPostDetail(id);

    return mapPostDetailResponseDtoToPost(response);
  }
}
