import type { Nullable } from '../../../shared/types';
import type {
  AuthRepository,
  AuthSession,
  AuthUser,
  LoginCredentials,
  TokenPair,
} from '../domain';
import {
  mapLoginCredentialsToRequestDto,
  mapLoginResponseDtoToAuthSession,
  mapProfileResponseDtoToAuthUser,
  mapRefreshResponseDtoToTokenPair,
} from './authMapper';
import type { AuthLocalDataSource } from './authLocalDataSource';
import type { AuthRemoteDataSource } from './authRemoteDataSource';

export class DefaultAuthRepository implements AuthRepository {
  constructor(
    private readonly remoteDataSource: AuthRemoteDataSource,
    private readonly localDataSource: AuthLocalDataSource,
  ) {}

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const request = mapLoginCredentialsToRequestDto(credentials);
    const response = await this.remoteDataSource.login(request);
    const session = mapLoginResponseDtoToAuthSession(response);

    await this.localDataSource.saveTokenPair(session.tokenPair);

    return session;
  }

  async logout(): Promise<void> {
    await this.localDataSource.clearTokenPair();
  }

  restoreToken(): Promise<Nullable<TokenPair>> {
    return this.localDataSource.getTokenPair();
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    const response = await this.remoteDataSource.refreshToken({ refreshToken });
    const tokenPair = mapRefreshResponseDtoToTokenPair(
      response,
      refreshToken,
    );

    await this.localDataSource.saveTokenPair(tokenPair);

    return tokenPair;
  }

  async getProfile(): Promise<AuthUser> {
    const response = await this.remoteDataSource.getProfile();

    return mapProfileResponseDtoToAuthUser(response);
  }
}
