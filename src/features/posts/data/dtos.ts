export interface PostResponseDto {
  readonly id: number;
  readonly title: string;
  readonly content: string;
  readonly UserId?: number;
  readonly userId?: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export type PostDetailResponseDto = PostResponseDto;
