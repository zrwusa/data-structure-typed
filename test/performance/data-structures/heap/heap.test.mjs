import { Heap } from '../../../../dist/esm/index.mjs';
import Benchmark from 'benchmark';
import { getRandomInt, magnitude } from '../../../utils/perf.mjs';

const suite = new Benchmark.Suite();
const { HUNDRED_THOUSAND } = magnitude;

const indicesHT = new Array(HUNDRED_THOUSAND)
    .fill(0)
    .map(() => getRandomInt(0, HUNDRED_THOUSAND - 1));

suite.add('100K add', function() {
    const heap = new Heap([], { comparator: (a, b) => b - a });
    for (let i = 0; i < HUNDRED_THOUSAND; i++) {
        heap.add(indicesHT[i]);
    }
    this.val = heap;
});

suite.add('100K add & poll', function() {
    const heap = new Heap([], { comparator: (a, b) => b - a });
    for (let i = 0; i < HUNDRED_THOUSAND; i++) {
        heap.add(indicesHT[i]);
    }
    for (let i = 0; i < HUNDRED_THOUSAND; i++) {
        heap.poll();
    }
    this.val = heap;
});

export { suite };
