/**
 * Centralized error message templates.
 * Keep using native Error/TypeError/RangeError — this only standardizes messages.
 */
export const ERR = {
  indexOutOfRange: (index: number, min: number, max: number, ctx?: string) =>
    `${ctx ? ctx + ': ' : ''}Index ${index} is out of range [${min}, ${max}].`,

  invalidIndex: (ctx?: string) =>
    `${ctx ? ctx + ': ' : ''}Index must be an integer.`,

  invalidArgument: (reason: string, ctx?: string) =>
    `${ctx ? ctx + ': ' : ''}${reason}`,

  comparatorRequired: (ctx?: string) =>
    `${ctx ? ctx + ': ' : ''}Comparator is required for non-number/non-string/non-Date keys.`,

  invalidKey: (reason: string, ctx?: string) =>
    `${ctx ? ctx + ': ' : ''}${reason}`,

  invalidOperation: (reason: string, ctx?: string) =>
    `${ctx ? ctx + ': ' : ''}${reason}`,

  matrixDimensionMismatch: (op: string) =>
    `Matrix: dimensions must be compatible for ${op}.`,

  matrixSingular: () =>
    'Matrix: singular matrix, inverse does not exist.',

  notAFunction: (name: string, ctx?: string) =>
    `${ctx ? ctx + ': ' : ''}${name} must be a function.`
} as const;
