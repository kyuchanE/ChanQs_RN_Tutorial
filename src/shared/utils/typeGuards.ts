export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const isString = (value: unknown): value is string =>
  typeof value === 'string';

export const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

export const isBoolean = (value: unknown): value is boolean =>
  typeof value === 'boolean';

export const hasOwnKey = <TKey extends string>(
  value: unknown,
  key: TKey,
): value is Record<TKey, unknown> => isRecord(value) && key in value;

export const isPositiveInteger = (value: unknown): value is number =>
  Number.isInteger(value) && isNumber(value) && value > 0;

