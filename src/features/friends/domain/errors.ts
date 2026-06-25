export type FriendsDomainErrorKind =
  | 'network'
  | 'timeout'
  | 'unauthorized'
  | 'forbidden'
  | 'notFound'
  | 'server'
  | 'unknown';

export interface FriendsDomainErrorPayload {
  readonly kind: FriendsDomainErrorKind;
  readonly message: string;
  readonly status?: number;
}

export class FriendsDomainException
  extends Error
  implements FriendsDomainErrorPayload
{
  readonly kind: FriendsDomainErrorKind;

  readonly status?: number;

  constructor(payload: FriendsDomainErrorPayload) {
    super(payload.message);
    this.name = 'FriendsDomainException';
    this.kind = payload.kind;
    this.status = payload.status;
  }
}
