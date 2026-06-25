import type { Friend, FriendsRepository } from '../domain';
import { mapFriendResponseDtoToFriend } from './friendMapper';
import type { FriendsRemoteDataSource } from './friendsRemoteDataSource';

export class DefaultFriendsRepository implements FriendsRepository {
  constructor(private readonly remoteDataSource: FriendsRemoteDataSource) {}

  async getFriends(): Promise<readonly Friend[]> {
    const response = await this.remoteDataSource.getFriends();

    return response.map(mapFriendResponseDtoToFriend);
  }
}
