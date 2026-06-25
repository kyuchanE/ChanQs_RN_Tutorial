export type FriendId = number;

export interface Friend {
  readonly id: FriendId;
  readonly name: string;
  readonly username: string | null;
  readonly email: string | null;
  readonly phone: string | null;
  readonly website: string | null;
  readonly addressLabel: string | null;
  readonly profileImageUrl: string | null;
}
