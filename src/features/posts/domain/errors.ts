export type PostsDomainErrorKind =
  | 'network'
  | 'timeout'
  | 'unauthorized'
  | 'forbidden'
  | 'notFound'
  | 'server'
  | 'unknown';

export interface PostsDomainErrorPayload {
  readonly kind: PostsDomainErrorKind;
  readonly message: string;
  readonly status?: number;
}

export class PostsDomainException
  extends Error
  implements PostsDomainErrorPayload
{
  readonly kind: PostsDomainErrorKind;

  readonly status?: number;

  constructor(payload: PostsDomainErrorPayload) {
    super(payload.message);
    this.name = 'PostsDomainException';
    this.kind = payload.kind;
    this.status = payload.status;
  }
}
