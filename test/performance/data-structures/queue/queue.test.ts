import {Queue} from '../../../../src';

import * as Benchmark from 'benchmark';

export const suite = new Benchmark.Suite();

suite
  .add('push 1000000', () => {
    const queue = new Queue<number>();
    for (let i = 0; i < 1000000; i++) {
      queue.push(i);
    }
  })
  .add('push & shift 1000000', () => {
    const queue = new Queue<number>();
    for (let i = 0; i < 1000000; i++) {
      queue.push(i);
      queue.shift();
    }
  });
