import type { Nullable } from '../../../shared/types';
import type { AuthSession, AuthUser, LoginCredentials, TokenPair } from './entities';
import type { AuthRepository } from './repository';

interface UseCase<TInput, TOutput> {
  readonly execute: (input: TInput) => Promise<TOutput>;
}

interface NoInputUseCase<TOutput> {
  readonly execute: () => Promise<TOutput>;
}

export class LoginUseCase implements UseCase<LoginCredentials, AuthSession> {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(credentials: LoginCredentials): Promise<AuthSession> {
    return this.authRepository.login(credentials);
  }
}

export class LogoutUseCase implements NoInputUseCase<void> {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(): Promise<void> {
    return this.authRepository.logout();
  }
}

export class RestoreTokenUseCase
  implements NoInputUseCase<Nullable<TokenPair>>
{
  constructor(private readonly authRepository: AuthRepository) {}

  execute(): Promise<Nullable<TokenPair>> {
    return this.authRepository.restoreToken();
  }
}

export class RefreshTokenUseCase implements UseCase<string, TokenPair> {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(refreshToken: string): Promise<TokenPair> {
    return this.authRepository.refreshToken(refreshToken);
  }
}

export class GetAuthProfileUseCase implements NoInputUseCase<AuthUser> {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(): Promise<AuthUser> {
    return this.authRepository.getProfile();
  }
}
