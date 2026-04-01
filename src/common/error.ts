/**
 * Centralized error dispatch.
 * All library errors go through this function for consistent messaging and easy grep.
 * @remarks Always throws — data structure errors are never recoverable.
 * @param ErrorClass - The error constructor (Error, TypeError, RangeError, etc.)
 * @param message - The error message.
 */
export function raise(
  ErrorClass: new (msg: string) => Error,
  message: string
): never {
  throw new ErrorClass(message);
}

/**
 * Centralized error message templates.
 * Keep using native Error/TypeError/RangeError — this only standardizes messages.
 */
export const ERR = {
  // Range / index
  indexOutOfRange: (index: number, min: number, max: number, ctx?: string) =>
    `${ctx ? ctx + ': ' : ''}Index ${index} is out of range [${min}, ${max}].`,
  invalidIndex: (ctx?: string) =>
    `${ctx ? ctx + ': ' : ''}Index must be an integer.`,
  // Type / argument
  invalidArgument: (reason: string, ctx?: string) =>
    `${ctx ? ctx + ': ' : ''}${reason}`,
  comparatorRequired: (ctx?: string) =>
    `${ctx ? ctx + ': ' : ''}Comparator is required for non-number/non-string/non-Date keys.`,
  invalidKey: (reason: string, ctx?: string) =>
    `${ctx ? ctx + ': ' : ''}${reason}`,
  notAFunction: (name: string, ctx?: string) =>
    `${ctx ? ctx + ': ' : ''}${name} must be a function.`,
  invalidEntry: (ctx?: string) =>
    `${ctx ? ctx + ': ' : ''}Each entry must be a [key, value] tuple.`,
  invalidNaN: (ctx?: string) =>
    `${ctx ? ctx + ': ' : ''}NaN is not a valid key.`,
  invalidDate: (ctx?: string) =>
    `${ctx ? ctx + ': ' : ''}Invalid Date key.`,
  reduceEmpty: (ctx?: string) =>
    `${ctx ? ctx + ': ' : ''}Reduce of empty structure with no initial value.`,
  callbackReturnType: (expected: string, got: string, ctx?: string) =>
    `${ctx ? ctx + ': ' : ''}Callback must return ${expected}; got ${got}.`,
  // State / operation
  invalidOperation: (reason: string, ctx?: string) =>
    `${ctx ? ctx + ': ' : ''}${reason}`,
  // Matrix
  matrixDimensionMismatch: (op: string) =>
    `Matrix: Dimensions must be compatible for ${op}.`,
  matrixSingular: () =>
    'Matrix: Singular matrix, inverse does not exist.',
  matrixNotSquare: () =>
    'Matrix: Must be square for inversion.',
  matrixNotRectangular: () =>
    'Matrix: Must be rectangular for transposition.',
  matrixRowMismatch: (expected: number, got: number) =>
    `Matrix: Expected row length ${expected}, but got ${got}.`,
  // Order statistic
  orderStatisticNotEnabled: (method: string, ctx?: string) =>
    `${ctx ? ctx + ': ' : ''}${method}() requires enableOrderStatistic: true.`
} as const;
