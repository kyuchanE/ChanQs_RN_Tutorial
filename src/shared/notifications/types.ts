import type { DeepLinkPath } from '../types';

export type NotificationType = 'postDetail' | 'general';

export interface PushNotificationPayload {
  readonly type: NotificationType;
  readonly title?: string;
  readonly body?: string;
  readonly path?: DeepLinkPath;
  readonly postId?: number;
}

