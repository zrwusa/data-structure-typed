export type Direction = 'up' | 'right' | 'down' | 'left';
export type Turning = { [key in Direction]: Direction };

export type NavigatorParams<T> = {
    matrix: T[][],
    turning: Turning,
    onMove: (cur: [number, number]) => void
    init: {
        cur: [number, number],
        charDir: Direction,
        VISITED: T,
    }
}
