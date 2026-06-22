export type PostId = number;

export interface PostListItem {
  readonly id: PostId;
  readonly title: string;
  readonly excerpt: string;
  readonly authorId: number | null;
  readonly createdAt: string | null;
}

export interface Post {
  readonly id: PostId;
  readonly title: string;
  readonly content: string;
  readonly authorId: number | null;
  readonly createdAt: string | null;
  readonly updatedAt: string | null;
}
