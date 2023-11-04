import {FibonacciHeap, Heap} from '../../../../src';
import * as Benchmark from 'benchmark';
import {magnitude} from '../../../utils';

const suite = new Benchmark.Suite();
const {TEN_THOUSAND} = magnitude;

suite
  .add(`${TEN_THOUSAND.toLocaleString()} add & pop`, () => {
    const heap = new Heap<number>({comparator: (a, b) => b - a});

    for (let i = 0; i < TEN_THOUSAND; i++) {
      heap.add(i);
    }

    for (let i = 0; i < TEN_THOUSAND; i++) {
      heap.pop();
    }
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

export {suite};
