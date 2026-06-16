import type {
  AuthSession,
  AuthUser,
  LoginCredentials,
  TokenPair,
} from '../domain';
import type {
  LoginRequestDto,
  LoginResponseDto,
  ProfileResponseDto,
  RefreshResponseDto,
} from './dtos';

export const mapLoginCredentialsToRequestDto = (
  credentials: LoginCredentials,
): LoginRequestDto => ({
  email: credentials.email.trim(),
  password: credentials.password,
});

export const mapProfileResponseDtoToAuthUser = (
  dto: ProfileResponseDto,
): AuthUser => ({
  id: String(dto.id),
  email: dto.email,
  name: dto.name,
  profileImageUrl: dto.profileImageUrl ?? dto.avatarUrl ?? null,
});

export const mapLoginResponseDtoToAuthSession = (
  dto: LoginResponseDto,
): AuthSession => ({
  user: mapProfileResponseDtoToAuthUser(dto.user),
  tokenPair: {
    accessToken: dto.accessToken,
    refreshToken: dto.refreshToken,
  },
});

export const mapRefreshResponseDtoToTokenPair = (
  dto: RefreshResponseDto,
  fallbackRefreshToken: string,
): TokenPair => ({
  accessToken: dto.accessToken,
  refreshToken: dto.refreshToken ?? fallbackRefreshToken,
});
