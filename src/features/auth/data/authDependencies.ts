import {
  GetAuthProfileUseCase,
  LoginUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
  RestoreTokenUseCase,
} from '../domain';
import { SecureAuthLocalDataSource } from './authLocalDataSource';
import { HttpAuthRemoteDataSource } from './authRemoteDataSource';
import { DefaultAuthRepository } from './authRepositoryImpl';

export const authRemoteDataSource = new HttpAuthRemoteDataSource();

export const authLocalDataSource = new SecureAuthLocalDataSource();

export const authRepository = new DefaultAuthRepository(
  authRemoteDataSource,
  authLocalDataSource,
);

export const loginUseCase = new LoginUseCase(authRepository);

export const logoutUseCase = new LogoutUseCase(authRepository);

export const restoreTokenUseCase = new RestoreTokenUseCase(authRepository);

export const refreshTokenUseCase = new RefreshTokenUseCase(authRepository);

export const getAuthProfileUseCase = new GetAuthProfileUseCase(authRepository);
