/**
 * Centralized error handling for data-structure-typed.
 *
 * All thrown errors should go through these helpers to ensure
 * consistent error types, codes, and messages.
 */

export enum DSTErrorCode {
  // Range / index errors
  INDEX_OUT_OF_RANGE = 'INDEX_OUT_OF_RANGE',
  INVALID_INDEX = 'INVALID_INDEX',
  RANGE_ERROR = 'RANGE_ERROR',

  // Type / argument errors
  INVALID_ARGUMENT = 'INVALID_ARGUMENT',
  COMPARATOR_REQUIRED = 'COMPARATOR_REQUIRED',
  INVALID_KEY = 'INVALID_KEY',
  NOT_A_FUNCTION = 'NOT_A_FUNCTION',

  // State errors
  INVALID_OPERATION = 'INVALID_OPERATION',
  EMPTY_COLLECTION = 'EMPTY_COLLECTION',

  // Matrix errors
  MATRIX_DIMENSION_MISMATCH = 'MATRIX_DIMENSION_MISMATCH',
  MATRIX_SINGULAR = 'MATRIX_SINGULAR',
  MATRIX_NOT_SQUARE = 'MATRIX_NOT_SQUARE',
  MATRIX_NOT_RECTANGULAR = 'MATRIX_NOT_RECTANGULAR',

  // Generic
  UNKNOWN = 'UNKNOWN'
}

/**
 * Base error class for all data-structure-typed errors.
 * Includes a machine-readable `code` for programmatic handling.
 */
export class DSTError extends Error {
  readonly code: DSTErrorCode;

  constructor(code: DSTErrorCode, message: string) {
    super(message);
    this.name = 'DSTError';
    this.code = code;
  }
}

export class DSTRangeError extends RangeError {
  readonly code: DSTErrorCode;

  constructor(code: DSTErrorCode, message: string) {
    super(message);
    this.name = 'DSTRangeError';
    this.code = code;
  }
}

export class DSTTypeError extends TypeError {
  readonly code: DSTErrorCode;

  constructor(code: DSTErrorCode, message: string) {
    super(message);
    this.name = 'DSTTypeError';
    this.code = code;
  }
}

// ── Factory helpers ───────────────────────────────────────────────

export function indexOutOfRange(index: number, min: number, max: number, context?: string): DSTRangeError {
  const prefix = context ? `${context}: ` : '';
  return new DSTRangeError(
    DSTErrorCode.INDEX_OUT_OF_RANGE,
    `${prefix}Index ${index} is out of range [${min}, ${max}].`
  );
}

export function invalidArgument(message: string, context?: string): DSTError {
  const prefix = context ? `${context}: ` : '';
  return new DSTError(DSTErrorCode.INVALID_ARGUMENT, `${prefix}${message}`);
}

export function comparatorRequired(context?: string): DSTTypeError {
  const prefix = context ? `${context}: ` : '';
  return new DSTTypeError(
    DSTErrorCode.COMPARATOR_REQUIRED,
    `${prefix}Comparator is required for non-number/non-string/non-Date keys.`
  );
}

export function invalidKey(reason: string, context?: string): DSTTypeError {
  const prefix = context ? `${context}: ` : '';
  return new DSTTypeError(DSTErrorCode.INVALID_KEY, `${prefix}${reason}`);
}

export function matrixError(code: DSTErrorCode, message: string): DSTError {
  return new DSTError(code, `Matrix: ${message}`);
}
