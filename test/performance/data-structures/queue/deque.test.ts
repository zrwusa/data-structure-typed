import { Deque } from '../../../../src';
import { Deque as CDeque } from 'js-sdsl';
import * as Benchmark from 'benchmark';
import { magnitude } from '../../../utils';
import { isCompetitor } from '../../../config';

export const suite = new Benchmark.Suite();
const { LINEAR } = magnitude;

suite.add(`${LINEAR.toLocaleString()} push`, () => {
  const deque = new Deque<number>();
  for (let i = 0; i < LINEAR; i++) deque.push(i);
});

if (isCompetitor) {
  suite.add(`${LINEAR.toLocaleString()} CPT push`, () => {
    const _deque = new CDeque<number>();
    for (let i = 0; i < LINEAR; i++) _deque.pushBack(i);
  });
}


suite.add(`${LINEAR.toLocaleString()} push & pop`, () => {
  const _deque = new Deque<number>();

  for (let i = 0; i < LINEAR; i++) _deque.push(i);
  for (let i = 0; i < LINEAR; i++) _deque.pop();

});
suite.add(`${LINEAR.toLocaleString()} push & shift`, () => {
  const _deque = new Deque<number>();

  for (let i = 0; i < LINEAR; i++) _deque.push(i);
  for (let i = 0; i < LINEAR; i++) _deque.shift();
});
suite.add(`${LINEAR.toLocaleString()} unshift & shift`, () => {
  const _deque = new Deque<number>();

  for (let i = 0; i < LINEAR; i++) _deque.unshift(i);
  for (let i = 0; i < LINEAR; i++) _deque.shift();
});
