import type { Post, PostId, PostListItem } from './entities';
import type { PostsRepository } from './repository';

interface UseCase<TInput, TOutput> {
  readonly execute: (input: TInput) => Promise<TOutput>;
}

interface NoInputUseCase<TOutput> {
  readonly execute: () => Promise<TOutput>;
}

export class GetPostsUseCase
  implements NoInputUseCase<readonly PostListItem[]>
{
  constructor(private readonly postsRepository: PostsRepository) {}

  execute(): Promise<readonly PostListItem[]> {
    return this.postsRepository.getPosts();
  }
}

export class GetPostDetailUseCase implements UseCase<PostId, Post> {
  constructor(private readonly postsRepository: PostsRepository) {}

  execute(id: PostId): Promise<Post> {
    return this.postsRepository.getPostDetail(id);
  }
}
