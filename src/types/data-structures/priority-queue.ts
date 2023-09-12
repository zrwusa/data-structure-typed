export type PriorityQueueComparator<T> = (a: T, b: T) => number;

export type PriorityQueueOptions<T> = {
    nodes?: T[];
    isFix?: boolean;
    comparator: PriorityQueueComparator<T>;
}

export type PriorityQueueDFSOrderPattern = 'pre' | 'in' | 'post';