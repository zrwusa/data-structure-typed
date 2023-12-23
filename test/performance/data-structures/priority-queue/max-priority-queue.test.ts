import { MaxPriorityQueue } from '../../../../src';
import * as Benchmark from 'benchmark';
import { magnitude } from '../../../utils';

const suite = new Benchmark.Suite();
const { TEN_THOUSAND } = magnitude;

suite.add(`${TEN_THOUSAND.toLocaleString()} refill & poll`, () => {
  const nodes = Array.from(
    new Set<number>(Array.from(new Array(TEN_THOUSAND), () => Math.floor(Math.random() * TEN_THOUSAND * 100)))
  );
  const maxPQ = new MaxPriorityQueue<number>();
  maxPQ.refill(nodes);
  while (maxPQ.size > 0) maxPQ.poll();
});

// export { suite };
