export const isNumber = (value: any) => {
  return typeof value === 'number';
};
export const isString = (value: any) => {
  return typeof value === 'string';
};
export const isBoolean = (value: any) => {
  return typeof value === 'boolean';
};
export const isDate = (value: any) => {
  return value instanceof Date;
};
export const isNull = (value: any) => {
  return value === null;
};
export const isUndefined = (value: any) => {
  return typeof value === 'undefined';
};
export const isFunction = (value: any) => {
  return typeof value === 'function';
};
export const isObject = (value: any) => {
  return typeof value === 'object';
};
export const isArray = (value: any) => {
  return Array.isArray(value);
};

export const isEqual = (objA: any, objB: any): boolean => {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || typeof objB !== 'object' || objA === null || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!keysB.includes(key)) {
      return false;
    }

    if (!isEqual(objA[key], objB[key])) {
      return false;
    }
  }

  return true;
};
