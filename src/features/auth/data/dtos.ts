import type { Nullable } from '../../../shared/types';

export interface LoginRequestDto {
  readonly email: string;
  readonly password: string;
}

export interface LoginResponseDto {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly user: ProfileResponseDto;
}

export interface RefreshRequestDto {
  readonly refreshToken: string;
}

export interface RefreshResponseDto {
  readonly accessToken: string;
  readonly refreshToken?: string;
}

export interface ProfileResponseDto {
  readonly id: string | number;
  readonly email: string;
  readonly name: string;
  readonly profileImageUrl?: Nullable<string>;
  readonly avatarUrl?: Nullable<string>;
}
