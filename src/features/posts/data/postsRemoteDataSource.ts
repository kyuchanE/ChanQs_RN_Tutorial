import type { AxiosInstance } from 'axios';

import { apiClient } from '../../../shared/api';
import type { PostDetailResponseDto, PostResponseDto } from './dtos';

export interface PostsRemoteDataSource {
  readonly getPosts: () => Promise<readonly PostResponseDto[]>;
  readonly getPostDetail: (id: number) => Promise<PostDetailResponseDto>;
}

export class HttpPostsRemoteDataSource implements PostsRemoteDataSource {
  constructor(private readonly client: AxiosInstance = apiClient) {}

  async getPosts(): Promise<readonly PostResponseDto[]> {
    const response = await this.client.get<readonly PostResponseDto[]>(
      '/posts',
    );

    return response.data;
  }

  async getPostDetail(id: number): Promise<PostDetailResponseDto> {
    const response = await this.client.get<PostDetailResponseDto>(
      `/posts/${id}`,
    );

    return response.data;
  }
}
