export type KeyValueObject = { [key: string]: any };

export type KeyValueObjectWithId = { [key: string]: any, id: string | number | symbol };

export type NonNumberNonObjectButDefined = string | boolean | symbol | null;

export type ObjectWithoutId = Omit<KeyValueObject, 'id'>;

export type ObjectWithNonNumberId = {
    [key: string]: any,
    id: string | boolean | symbol | null | object | undefined;
}

export type ObjectWithNumberId = {
    [key: string]: any,
    id: number;
}

export type RestrictValById =
    NonNumberNonObjectButDefined
    | ObjectWithoutId
    | ObjectWithNonNumberId
    | ObjectWithNumberId;

export type DummyAny = string | number | boolean | null | undefined | object | symbol | void | Function | never;