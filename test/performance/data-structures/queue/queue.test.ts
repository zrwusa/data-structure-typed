import {Queue} from '../../../../src';
import {Queue as CQueue} from 'js-sdsl';
import * as Benchmark from 'benchmark';
import {magnitude} from '../../../utils';
import {isCompetitor} from "../../../config";

const suite = new Benchmark.Suite();
const {LINEAR} = magnitude;

suite
  .add(`${LINEAR.toLocaleString()} push`, () => {
    const queue = new Queue<number>();

    for (let i = 0; i < LINEAR; i++) {
      queue.push(i);
    }
  })
if (isCompetitor) {
  suite.add(`${LINEAR.toLocaleString()} competitor push`, () => {
    const queue = new CQueue<number>();

    for (let i = 0; i < LINEAR; i++) {
      queue.push(i);
    }
  })
}
suite.add(`${LINEAR.toLocaleString()} push & shift`, () => {
  const queue = new Queue<number>();

  for (let i = 0; i < LINEAR; i++) {
    queue.push(i);
    queue.shift();
  }
});

export {suite};
