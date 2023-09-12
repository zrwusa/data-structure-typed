export type HeapOptions<T> = {
    priorityExtractor?: (element: T) => number;
    // TODO there is an idea that support chaining which is for conveniently using the data structure
    // isChaining? : boolean
}