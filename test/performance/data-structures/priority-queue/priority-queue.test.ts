import { PriorityQueue as CPriorityQueue } from 'js-sdsl';
import { PriorityQueue } from '../../../../src';
import * as Benchmark from 'benchmark';
import { magnitude } from '../../../utils';
import { isCompetitor } from '../../../config';

const suite = new Benchmark.Suite();
const { TEN_THOUSAND } = magnitude;

suite.add(`${TEN_THOUSAND.toLocaleString()} add & pop`, () => {
  const pq = new PriorityQueue<number>({ comparator: (a, b) => b - a });

  for (let i = 0; i < TEN_THOUSAND; i++) {
    pq.add(i);
  }

  for (let i = 0; i < TEN_THOUSAND; i++) {
    pq.pop();
  }
});
if (isCompetitor) {
  suite.add(`${TEN_THOUSAND.toLocaleString()} competitor add & pop`, () => {
    const pq = new CPriorityQueue<number>();

    for (let i = 0; i < TEN_THOUSAND; i++) {
      pq.push(i);
    }

    for (let i = 0; i < TEN_THOUSAND; i++) {
      pq.pop();
    }
  });
}

export { suite };
