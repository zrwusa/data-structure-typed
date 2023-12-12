import { PriorityQueue as CPriorityQueue } from 'js-sdsl';
import { PriorityQueue } from '../../../../src';
import * as Benchmark from 'benchmark';
import { magnitude } from '../../../utils';
import { isCompetitor } from '../../../config';

const suite = new Benchmark.Suite();
const { HUNDRED_THOUSAND } = magnitude;

suite.add(`${HUNDRED_THOUSAND.toLocaleString()} add & poll`, () => {
  const pq = new PriorityQueue<number>([], { comparator: (a, b) => b - a });

  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    pq.add(i);
  }

  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    pq.poll();
  }
});
if (isCompetitor) {
  suite.add(`CPT ${HUNDRED_THOUSAND.toLocaleString()} add & pop`, () => {
    const pq = new CPriorityQueue<number>();

    for (let i = 0; i < HUNDRED_THOUSAND; i++) {
      pq.push(i);
    }

    for (let i = 0; i < HUNDRED_THOUSAND; i++) {
      pq.pop();
    }
  });
}

export { suite };
