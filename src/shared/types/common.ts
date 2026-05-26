export type Nullable<TValue> = TValue | null;

export type Optional<TValue> = TValue | undefined;

export type ValueOf<TObject extends Record<string, unknown>> =
  TObject[keyof TObject];

export type EntityId = string | number;

