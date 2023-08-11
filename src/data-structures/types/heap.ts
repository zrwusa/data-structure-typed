export interface HeapOptions<T> {
    priority?: (element: T) => number;
}

export interface HeapItem<T> {
    priority: number;
    element: T | null;
}