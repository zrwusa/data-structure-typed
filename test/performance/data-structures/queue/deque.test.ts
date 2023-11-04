import {Deque} from '../../../../src';
import * as Benchmark from 'benchmark';
import {magnitude} from '../../../utils';

export const suite = new Benchmark.Suite();
const {LINEAR} = magnitude;

suite
  .add(`${LINEAR.toLocaleString()} push`, () => {
    const deque = new Deque<number>();
    for (let i = 0; i < LINEAR; i++) {
      deque.push(i);
    }
  })
  .add(`${LINEAR.toLocaleString()} shift`, () => {
    const deque = new Deque<number>();
    for (let i = 0; i < LINEAR; i++) {
      deque.push(i);
      deque.shift();
    }
  });
