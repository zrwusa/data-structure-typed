import {Queue} from '../../../../src';
import * as Benchmark from 'benchmark';
import {magnitude} from '../../../utils';

const suite = new Benchmark.Suite();
const {LINEAR} = magnitude;

suite
  .add(`${LINEAR} push`, () => {
    const queue = new Queue<number>();

    for (let i = 0; i < LINEAR; i++) {
      queue.push(i);
    }
  })
  .add(`${LINEAR} push & shift`, () => {
    const queue = new Queue<number>();

    for (let i = 0; i < LINEAR; i++) {
      queue.push(i);
      queue.shift();
    }
  });

export {suite};
