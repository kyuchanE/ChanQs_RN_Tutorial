export type ApiResponse<TData, TMeta = undefined> = TMeta extends undefined
  ? {
      data: TData;
    }
  : {
      data: TData;
      meta: TMeta;
    };

export type ApiListResponse<TItem, TMeta = undefined> = ApiResponse<
  TItem[],
  TMeta
>;

export type ApiErrorKind =
  | 'network'
  | 'timeout'
  | 'unauthorized'
  | 'forbidden'
  | 'notFound'
  | 'server'
  | 'unknown';

export interface ApiError<TDetails = unknown> {
  readonly kind: ApiErrorKind;
  readonly message: string;
  readonly status?: number;
  readonly code?: string;
  readonly details?: TDetails;
}

export type ApiResult<TData, TError extends ApiError = ApiError> =
  | {
      readonly ok: true;
      readonly data: TData;
    }
  | {
      readonly ok: false;
      readonly error: TError;
    };

