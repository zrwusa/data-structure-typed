import {Stack} from '../../../../src';
import {Stack as CStack} from 'js-sdsl';
import * as Benchmark from 'benchmark';
import {magnitude} from '../../../utils';

const suite = new Benchmark.Suite();
const {LINEAR} = magnitude;

suite
  .add(`${LINEAR.toLocaleString()} push`, () => {
    const stack = new Stack<number>();

    for (let i = 0; i < LINEAR; i++) {
      stack.push(i);
    }
  })
  .add(`${LINEAR.toLocaleString()} competitor push`, () => {
    const queue = new CStack<number>();

    for (let i = 0; i < LINEAR; i++) {
      queue.push(i);
    }
  })
  .add(`${LINEAR.toLocaleString()} push & pop`, () => {
    const queue = new Stack<number>();

    for (let i = 0; i < LINEAR; i++) {
      queue.push(i);
    }
    for (let i = 0; i < LINEAR; i++) {
      queue.pop();
    }
  })
  .add(`${LINEAR.toLocaleString()} competitor push & pop`, () => {
    const queue = new CStack<number>();

    for (let i = 0; i < LINEAR; i++) {
      queue.push(i);
    }
    for (let i = 0; i < LINEAR; i++) {
      queue.pop();
    }
  });

export {suite};
