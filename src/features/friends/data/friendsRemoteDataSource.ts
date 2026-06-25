import type { AxiosInstance } from 'axios';

import { apiClient } from '../../../shared/api';
import type { FriendResponseDto } from './dtos';

export interface FriendsRemoteDataSource {
  readonly getFriends: () => Promise<readonly FriendResponseDto[]>;
}

export class HttpFriendsRemoteDataSource implements FriendsRemoteDataSource {
  constructor(private readonly client: AxiosInstance = apiClient) {}

  async getFriends(): Promise<readonly FriendResponseDto[]> {
    const response = await this.client.get<readonly FriendResponseDto[]>(
      '/users',
    );

    return response.data;
  }
}
