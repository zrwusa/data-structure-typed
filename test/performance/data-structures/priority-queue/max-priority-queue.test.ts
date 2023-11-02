import {MaxPriorityQueue} from '../../../../src';
import * as Benchmark from 'benchmark';
import {magnitude} from '../../../utils';

const suite = new Benchmark.Suite();
const {LINEAR} = magnitude;

suite.add(`refill & poll ${LINEAR}`, () => {
  const nodes = Array.from(
    new Set<number>(Array.from(new Array(LINEAR), () => Math.floor(Math.random() * LINEAR * 100)))
  );
  const maxPQ = new MaxPriorityQueue<number>();
  maxPQ.refill(nodes);
  while (maxPQ.size > 0) {
    maxPQ.poll();
  }
});

export {suite};
