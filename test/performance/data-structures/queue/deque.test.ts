import {Deque} from '../../../../src';
import {Deque as CDeque} from 'js-sdsl';
import * as Benchmark from 'benchmark';
import {magnitude} from '../../../utils';
import {isCompetitor} from '../../../config';

export const suite = new Benchmark.Suite();
const {LINEAR} = magnitude;

suite.add(`${LINEAR.toLocaleString()} push`, () => {
  const deque = new Deque<number>();
  for (let i = 0; i < LINEAR; i++) {
    deque.push(i);
  }
});
if (isCompetitor) {
  suite.add(`${LINEAR.toLocaleString()} competitor push`, () => {
    const deque = new CDeque<number>();
    for (let i = 0; i < LINEAR; i++) {
      deque.pushBack(i);
    }
  });
}
suite.add(`${LINEAR.toLocaleString()} shift`, () => {
  const deque = new Deque<number>();
  for (let i = 0; i < LINEAR; i++) {
    deque.push(i);
    deque.shift();
  }
});
