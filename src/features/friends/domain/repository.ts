import type { Friend } from './entities';

export interface FriendsRepository {
  readonly getFriends: () => Promise<readonly Friend[]>;
}
