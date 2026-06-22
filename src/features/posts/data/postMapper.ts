import type { Post, PostListItem } from '../domain';
import type { PostDetailResponseDto, PostResponseDto } from './dtos';

const EXCERPT_MAX_LENGTH = 120;

const normalizeOptionalString = (value: string | undefined): string | null =>
  value === undefined || value.trim().length === 0 ? null : value;

const normalizeAuthorId = (response: PostResponseDto): number | null =>
  response.userId ?? response.UserId ?? null;

const createExcerpt = (content: string): string => {
  const normalizedContent = content.trim().replace(/\s+/g, ' ');

  return normalizedContent.length > EXCERPT_MAX_LENGTH
    ? `${normalizedContent.slice(0, EXCERPT_MAX_LENGTH)}...`
    : normalizedContent;
};

export const mapPostResponseDtoToPostListItem = (
  response: PostResponseDto,
): PostListItem => ({
  id: response.id,
  title: response.title,
  excerpt: createExcerpt(response.content),
  authorId: normalizeAuthorId(response),
  createdAt: normalizeOptionalString(response.createdAt),
});

export const mapPostDetailResponseDtoToPost = (
  response: PostDetailResponseDto,
): Post => ({
  id: response.id,
  title: response.title,
  content: response.content,
  authorId: normalizeAuthorId(response),
  createdAt: normalizeOptionalString(response.createdAt),
  updatedAt: normalizeOptionalString(response.updatedAt),
});
