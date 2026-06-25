export interface FriendAddressResponseDto {
  readonly city?: string;
  readonly street?: string;
  readonly suite?: string;
  readonly zipcode?: string;
}

export interface FriendResponseDto {
  readonly id: number;
  readonly name: string;
  readonly username?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly website?: string;
  readonly province?: string;
  readonly city?: string;
  readonly district?: string;
  readonly street?: string;
  readonly zipcode?: string;
  readonly address?: FriendAddressResponseDto;
  readonly profileImageUrl?: string;
  readonly profileImage?: string;
  readonly avatar?: string;
  readonly image?: string;
}
