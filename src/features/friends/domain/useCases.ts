import type { Friend } from './entities';
import type { FriendsRepository } from './repository';

interface NoInputUseCase<TOutput> {
  readonly execute: () => Promise<TOutput>;
}

export class GetFriendsUseCase implements NoInputUseCase<readonly Friend[]> {
  constructor(private readonly friendsRepository: FriendsRepository) {}

  execute(): Promise<readonly Friend[]> {
    return this.friendsRepository.getFriends();
  }
}
