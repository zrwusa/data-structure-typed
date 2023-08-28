const orderReducedBy = 2; // reduction of magnitude's order compared to the baseline magnitude

export const magnitude = {
    CONSTANT: Math.floor(Number.MAX_SAFE_INTEGER / Math.pow(10, orderReducedBy)),
    LOG_N: Math.pow(10, 9 - orderReducedBy),
    LINEAR: Math.pow(10, 6 - orderReducedBy),
    N_LOG_N: Math.pow(10, 5 - orderReducedBy),
    SQUARED: Math.pow(10, 4 - orderReducedBy),
    CUBED: Math.pow(10, 3 - orderReducedBy),
    FACTORIAL: 20 - orderReducedBy
}