export type KeyValueObject = {[key: string]: any};

export type KeyValueObjectWithKey = {[key: string]: any; key: string | number | symbol};

export type NonNumberNonObjectButDefined = string | boolean | symbol | null;

export type ObjectWithoutKey = Omit<KeyValueObject, 'key'>;

export type ObjectWithNonNumberKey = {
  [key: string]: any;
  key: string | boolean | symbol | null | object | undefined;
};

export type ObjectWithNumberKey = {
  [key: string]: any;
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
