import { Deque } from '../../../../src';
import { Deque as CDeque } from 'js-sdsl';
import * as Benchmark from 'benchmark';
import { magnitude } from '../../../utils';
import { isCompetitor } from '../../../config';

export const suite = new Benchmark.Suite();
const { LINEAR } = magnitude;

suite.add(`${LINEAR.toLocaleString()} push`, () => {
  const deque = new Deque<number>();
  for (let i = 0; i < LINEAR; i++) {
    deque.push(i);
  }
});
if (isCompetitor) {
  suite.add(`${LINEAR.toLocaleString()} CPT push`, () => {
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

suite.add(`${LINEAR.toLocaleString()} push`, () => {
  const list = new Deque<number>();

  for (let i = 0; i < LINEAR; i++) {
    list.push(i);
  }
});
suite.add(`${LINEAR.toLocaleString()} push & pop`, () => {
  const list = new Deque<number>();

  for (let i = 0; i < LINEAR; i++) list.push(i);
  for (let i = 0; i < LINEAR; i++) list.pop();

});
suite.add(`${LINEAR.toLocaleString()} push & shift`, () => {
  const list = new Deque<number>();

  for (let i = 0; i < LINEAR; i++) list.push(i);
  for (let i = 0; i < LINEAR; i++) list.shift();
});
suite.add(`${LINEAR.toLocaleString()} unshift & shift`, () => {
  const list = new Deque<number>();

  for (let i = 0; i < LINEAR; i++) list.unshift(i);
  for (let i = 0; i < LINEAR; i++) list.shift();
});
