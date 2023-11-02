import {Deque} from '../../../../src';
import * as Benchmark from 'benchmark';

export const suite = new Benchmark.Suite();

suite
  .add('push', () => {
    const deque = new Deque<number>();
    for (let i = 0; i < 10; i++) {
      deque.push(i);
    }
  })
  .add('shift', () => {
    const deque = new Deque<number>();
    for (let i = 0; i < 10; i++) {
      deque.push(i);
      deque.shift();
    }
  });
