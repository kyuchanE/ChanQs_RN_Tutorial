export type ImageMimeType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/heic'
  | 'image/heif'
  | 'image/webp';

export interface ImageAssetMetadata {
  readonly uri: string;
  readonly width: number;
  readonly height: number;
  readonly mimeType?: ImageMimeType | string;
  readonly fileName?: string;
  readonly fileSize?: number;
}

