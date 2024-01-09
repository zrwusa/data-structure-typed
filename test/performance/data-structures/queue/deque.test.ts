import { Deque } from '../../../../src';
import { Deque as CDeque } from 'js-sdsl';
import * as Benchmark from 'benchmark';
import { magnitude } from '../../../utils';
import { isCompetitor } from '../../../config';

export const suite = new Benchmark.Suite();
const { MILLION, HUNDRED_THOUSAND } = magnitude;
// const randomIndicesTenThousand = new Array(TEN_THOUSAND).fill(getRandomInt(0, TEN_THOUSAND - 1));

suite.add(`${MILLION.toLocaleString()} push`, () => {
  const deque = new Deque<number>();
  for (let i = 0; i < MILLION; i++) deque.push(i);
});

if (isCompetitor) {
  suite.add(`CPT ${MILLION.toLocaleString()} push`, () => {
    const deque = new CDeque<number>();
    for (let i = 0; i < MILLION; i++) deque.pushBack(i);
  });
}

suite
  .add(`${MILLION.toLocaleString()} push & pop`, () => {
    const deque = new Deque<number>();

    for (let i = 0; i < MILLION; i++) deque.push(i);
    for (let i = 0; i < MILLION; i++) deque.pop();
  })
  .add(`${MILLION.toLocaleString()} push & shift`, () => {
    const deque = new Deque<number>();

    for (let i = 0; i < MILLION; i++) deque.push(i);
    for (let i = 0; i < MILLION; i++) deque.shift();
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} push & shift`, () => {
    const deque = new Deque<number>();

    for (let i = 0; i < HUNDRED_THOUSAND; i++) deque.push(i);
    for (let i = 0; i < HUNDRED_THOUSAND; i++) deque.shift();
  })
  .add(`Native JS Array ${HUNDRED_THOUSAND.toLocaleString()} push & shift`, () => {
    const array = new Array<number>();

    for (let i = 0; i < HUNDRED_THOUSAND; i++) array.push(i);
    for (let i = 0; i < HUNDRED_THOUSAND; i++) array.shift();
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} unshift & shift`, () => {
    const deque = new Deque<number>();

    for (let i = 0; i < HUNDRED_THOUSAND; i++) deque.unshift(i);
    for (let i = 0; i < HUNDRED_THOUSAND; i++) deque.shift();
  })
  .add(`Native JS Array ${HUNDRED_THOUSAND.toLocaleString()} unshift & shift`, () => {
    const array = new Array<number>();

    for (let i = 0; i < HUNDRED_THOUSAND; i++) array.unshift(i);
    for (let i = 0; i < HUNDRED_THOUSAND; i++) array.shift();
  });
