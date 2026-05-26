export type AppPermissionStatus =
  | 'granted'
  | 'denied'
  | 'blocked'
  | 'undetermined';

export type AppPermissionType = 'camera' | 'gallery' | 'notification';

export interface AppPermissionResult {
  readonly type: AppPermissionType;
  readonly status: AppPermissionStatus;
  readonly canAskAgain: boolean;
  readonly granted: boolean;
}

