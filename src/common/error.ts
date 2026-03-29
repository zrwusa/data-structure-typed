/**
 * Error handling mode for the library.
 * - 'throw': Throw errors (default, fail-fast)
 * - 'warn': console.warn and continue
 * - 'error': console.error and continue
 * - 'silent': Suppress all errors
 */
export type ErrorHandlingMode = 'throw' | 'warn' | 'error' | 'silent';

let _errorHandlingMode: ErrorHandlingMode = 'throw';

/**
 * Set the global error handling mode.
 * @param mode - The error handling mode to use.
 */
export function setErrorHandling(mode: ErrorHandlingMode): void {
  _errorHandlingMode = mode;
}

/**
 * Get the current error handling mode.
 */
export function getErrorHandling(): ErrorHandlingMode {
  return _errorHandlingMode;
}

/**
 * Raise an error through the configured error handling mode.
 * In 'throw' mode, throws the error. In other modes, logs and continues.
 * @param ErrorClass - The error constructor (Error, TypeError, RangeError, etc.)
 * @param message - The error message.
 */
export function raise(
  ErrorClass: new (msg: string) => Error,
  message: string
): void {
  switch (_errorHandlingMode) {
    case 'throw':
      throw new ErrorClass(message);
    case 'warn':
      console.warn(`[data-structure-typed] ${message}`);
      break;
    case 'error':
      console.error(`[data-structure-typed] ${message}`);
      break;
    case 'silent':
      break;
  }
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
