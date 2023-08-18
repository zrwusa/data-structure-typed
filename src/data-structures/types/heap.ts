export interface HeapOptions<T> {
    priority?: (element: T) => number;
    // TODO there is an idea that support chaining which is for conveniently using the data structure
    // isChaining? : boolean
}