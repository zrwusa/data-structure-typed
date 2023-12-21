import { Deque } from '../../../../src';
import { Deque as CDeque } from 'js-sdsl';
import * as Benchmark from 'benchmark';
import { magnitude } from '../../../utils';
import { isCompetitor } from '../../../config';

export const suite = new Benchmark.Suite();
const { MILLION, HUNDRED_THOUSAND } = magnitude;

suite.add(`${MILLION.toLocaleString()} push`, () => {
  const deque = new Deque<number>();
  for (let i = 0; i < MILLION; i++) deque.push(i);
});

if (isCompetitor) {
  suite.add(`CPT ${MILLION.toLocaleString()} push`, () => {
    const _deque = new CDeque<number>();
    for (let i = 0; i < MILLION; i++) _deque.pushBack(i);
  });
}


suite.add(`${MILLION.toLocaleString()} push & pop`, () => {
  const _deque = new Deque<number>();

  for (let i = 0; i < MILLION; i++) _deque.push(i);
  for (let i = 0; i < MILLION; i++) _deque.pop();

})
  .add(`${HUNDRED_THOUSAND.toLocaleString()} push & shift`, () => {
    const _deque = new Deque<number>();

    for (let i = 0; i < HUNDRED_THOUSAND; i++) _deque.push(i);
    for (let i = 0; i < HUNDRED_THOUSAND; i++) _deque.shift();
  })
  .add(`Native Array ${HUNDRED_THOUSAND.toLocaleString()} push & shift`, () => {
    const _deque = new Array<number>();

    for (let i = 0; i < HUNDRED_THOUSAND; i++) _deque.push(i);
    for (let i = 0; i < HUNDRED_THOUSAND; i++) _deque.shift();
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} unshift & shift`, () => {
    const _deque = new Deque<number>();

    for (let i = 0; i < HUNDRED_THOUSAND; i++) _deque.unshift(i);
    for (let i = 0; i < HUNDRED_THOUSAND; i++) _deque.shift();
  })
  .add(`Native Array ${HUNDRED_THOUSAND.toLocaleString()} unshift & shift`, () => {
    const _deque = new Array<number>();

    for (let i = 0; i < HUNDRED_THOUSAND; i++) _deque.unshift(i);
    for (let i = 0; i < HUNDRED_THOUSAND; i++) _deque.shift();
  });
