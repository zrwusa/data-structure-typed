export type PriorityQueueComparator<T> = (a: T, b: T) => number;

export interface PriorityQueueOptions<T> {
    nodes?: T[];
    isFix?: boolean;
    comparator: PriorityQueueComparator<T>;
}

export type PriorityQueueDFSOrderPattern = 'pre' | 'in' | 'post';