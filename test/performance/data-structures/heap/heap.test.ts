import { FibonacciHeap, Heap } from '../../../../src';
import * as Benchmark from 'benchmark';
import { magnitude } from '../../../utils';

const suite = new Benchmark.Suite();
const { HUNDRED_THOUSAND, TEN_THOUSAND } = magnitude;

suite
  .add(`${HUNDRED_THOUSAND.toLocaleString()} add & pop`, () => {
    const heap = new Heap<number>([], { comparator: (a, b) => b - a });

    for (let i = 0; i < HUNDRED_THOUSAND; i++) {
      heap.add(i);
    }

    for (let i = 0; i < HUNDRED_THOUSAND; i++) {
      heap.pop();
    }
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} add & dfs`, () => {
    const heap = new Heap<number>([], { comparator: (a, b) => b - a });

    for (let i = 0; i < HUNDRED_THOUSAND; i++) {
      heap.add(i);
    }

    heap.dfs();
  })
  .add(`${TEN_THOUSAND.toLocaleString()} fib add & pop`, () => {
    const fbHeap = new FibonacciHeap<number>();
    for (let i = 1; i <= TEN_THOUSAND; i++) {
      fbHeap.push(i);
    }
    for (let i = 1; i <= TEN_THOUSAND; i++) {
      fbHeap.pop();
    }
  });

export { suite };
