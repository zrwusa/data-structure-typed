import {FibonacciHeap, Heap} from '../../../../src';
import * as Benchmark from 'benchmark';
import {magnitude} from '../../../utils';

const suite = new Benchmark.Suite();
const {N_LOG_N} = magnitude;

suite
  .add(`${N_LOG_N} add & pop`, () => {
    const heap = new Heap<number>({comparator: (a, b) => b - a});

    for (let i = 0; i < N_LOG_N; i++) {
      heap.add(i);
    }

    for (let i = 0; i < N_LOG_N; i++) {
      heap.pop();
    }
  })
  .add(`${N_LOG_N} fib add & pop`, () => {
    const fbHeap = new FibonacciHeap<number>();
    for (let i = 1; i <= N_LOG_N; i++) {
      fbHeap.push(i);
    }
    for (let i = 1; i <= N_LOG_N; i++) {
      fbHeap.pop();
    }
  });

export {suite};
