export type KeyValueObject = { [key: string]: unknown };

export type KeyValueObjectWithKey = { [key: string]: unknown; key: string | number | symbol };

export type NonNumberNonObjectButDefined = string | boolean | symbol | null;

export type ObjectWithoutKey = Omit<KeyValueObject, 'key'>;

export type ObjectWithNonNumberKey = {
  [key: string]: unknown;
  key: string | boolean | symbol | null | object | undefined;
};

export type ObjectWithNumberKey = {
  [key: string]: unknown;
  key: number;
};

export type RestrictValByKey =
  | NonNumberNonObjectButDefined
  | ObjectWithoutKey
  | ObjectWithNonNumberKey
  | ObjectWithNumberKey;

export type DummyAny =
  | string
  | number
  | boolean
  | null
  | undefined
  | object
  | symbol
  | void
  | ((...args: []) => any)
  | never;
