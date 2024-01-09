import { Queue } from '../../../../src';
import { Queue as CQueue } from 'js-sdsl';
import * as Benchmark from 'benchmark';
import { magnitude } from '../../../utils';
import { isCompetitor } from '../../../config';

const suite = new Benchmark.Suite();
const { MILLION, HUNDRED_THOUSAND } = magnitude;

suite.add(`${MILLION.toLocaleString()} push`, () => {
  const queue = new Queue<number>();

  for (let i = 0; i < MILLION; i++) queue.push(i);
});
if (isCompetitor) {
  suite.add(`CPT ${MILLION.toLocaleString()} push`, () => {
    const queue = new CQueue<number>();

    for (let i = 0; i < MILLION; i++) queue.push(i);
  });
}
suite.add(`${HUNDRED_THOUSAND.toLocaleString()} push & shift`, () => {
  const queue = new Queue<number>();

  for (let i = 0; i < HUNDRED_THOUSAND; i++) queue.push(i);
  for (let i = 0; i < HUNDRED_THOUSAND; i++) queue.shift();
});
suite.add(`Native JS Array ${HUNDRED_THOUSAND.toLocaleString()} push & shift`, () => {
  const arr = new Array<number>();

  for (let i = 0; i < HUNDRED_THOUSAND; i++) arr.push(i);
  for (let i = 0; i < HUNDRED_THOUSAND; i++) arr.shift();
});

export { suite };
