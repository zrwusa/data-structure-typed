const orderReducedBy = 2; // reduction of magnitude's order compared to the baseline magnitude

export const magnitude = {
  CONSTANT: Math.floor(Number.MAX_SAFE_INTEGER / Math.pow(10, orderReducedBy)),
  LOG_N: Math.pow(10, 9 - orderReducedBy),
  LINEAR: Math.pow(10, 6 - orderReducedBy),
  N_LOG_N: Math.pow(10, 5 - orderReducedBy),
  SQUARED: Math.pow(10, 4 - orderReducedBy),
  CUBED: Math.pow(10, 3 - orderReducedBy),
  FACTORIAL: 20 - orderReducedBy
};

export const bigO = {
  CONSTANT: magnitude.CONSTANT / 100000,
  LOG_N: Math.log2(magnitude.LOG_N) / 1000,
  LINEAR: magnitude.LINEAR / 1000,
  N_LOG_N: (magnitude.N_LOG_N * Math.log2(magnitude.LOG_N)) / 1000,
  SQUARED: Math.pow(magnitude.SQUARED, 2) / 1000,
  CUBED: Math.pow(magnitude.SQUARED, 3) / 1000,
  FACTORIAL: 10000
};
