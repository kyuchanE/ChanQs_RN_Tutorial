export {
  friendsRemoteDataSource,
  friendsRepository,
  getFriendsUseCase,
} from './friendsDependencies';
export type { FriendAddressResponseDto, FriendResponseDto } from './dtos';
export { mapFriendResponseDtoToFriend } from './friendMapper';
export type { FriendsRemoteDataSource } from './friendsRemoteDataSource';
export { HttpFriendsRemoteDataSource } from './friendsRemoteDataSource';
export { DefaultFriendsRepository } from './friendsRepositoryImpl';
