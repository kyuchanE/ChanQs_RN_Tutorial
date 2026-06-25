import { GetFriendsUseCase } from '../domain';
import { HttpFriendsRemoteDataSource } from './friendsRemoteDataSource';
import { DefaultFriendsRepository } from './friendsRepositoryImpl';

export const friendsRemoteDataSource = new HttpFriendsRemoteDataSource();

export const friendsRepository = new DefaultFriendsRepository(
  friendsRemoteDataSource,
);

export const getFriendsUseCase = new GetFriendsUseCase(friendsRepository);
