import { GetPostDetailUseCase, GetPostsUseCase } from '../domain';
import { HttpPostsRemoteDataSource } from './postsRemoteDataSource';
import { DefaultPostsRepository } from './postsRepositoryImpl';

export const postsRemoteDataSource = new HttpPostsRemoteDataSource();

export const postsRepository = new DefaultPostsRepository(
  postsRemoteDataSource,
);

export const getPostsUseCase = new GetPostsUseCase(postsRepository);

export const getPostDetailUseCase = new GetPostDetailUseCase(
  postsRepository,
);
