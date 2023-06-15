import {PriorityQueue, PriorityQueueOptions} from './priority-queue';

export class MinPriorityQueue<T = number> extends PriorityQueue<T> {
    constructor(options: PriorityQueueOptions<T>) {
        super({
            nodes: options.nodes, comparator: (a: T, b: T) => {
                const aKey = a as unknown as number, bKey = b as unknown as number;
                return aKey - bKey;
            }
        });
    }
}