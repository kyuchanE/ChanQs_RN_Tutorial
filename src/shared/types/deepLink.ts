export type DeepLinkPath = `posts/${number}` | '';

export interface ParsedPostDeepLink {
  readonly type: 'postDetail';
  readonly postId: number;
}

export type ParsedDeepLink = ParsedPostDeepLink | null;

