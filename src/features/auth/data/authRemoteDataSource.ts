import type { AxiosInstance } from 'axios';

import { apiClient, publicApiClient } from '../../../shared/api';
import type {
  LoginRequestDto,
  LoginResponseDto,
  ProfileResponseDto,
  RefreshRequestDto,
  RefreshResponseDto,
} from './dtos';

export interface AuthRemoteDataSource {
  readonly login: (request: LoginRequestDto) => Promise<LoginResponseDto>;
  readonly refreshToken: (
    request: RefreshRequestDto,
  ) => Promise<RefreshResponseDto>;
  readonly getProfile: () => Promise<ProfileResponseDto>;
}

export class HttpAuthRemoteDataSource implements AuthRemoteDataSource {
  constructor(
    private readonly unauthenticatedClient: AxiosInstance = publicApiClient,
    private readonly authenticatedClient: AxiosInstance = apiClient,
  ) {}

  async login(request: LoginRequestDto): Promise<LoginResponseDto> {
    const response = await this.unauthenticatedClient.post<LoginResponseDto>(
      '/auth/login',
      request,
    );

    return response.data;
  }

  async refreshToken(
    request: RefreshRequestDto,
  ): Promise<RefreshResponseDto> {
    const response =
      await this.unauthenticatedClient.post<RefreshResponseDto>(
        '/auth/refresh',
        request,
      );

    return response.data;
  }

  async getProfile(): Promise<ProfileResponseDto> {
    const response =
      await this.authenticatedClient.get<ProfileResponseDto>('/auth/profile');

    return response.data;
  }
}
