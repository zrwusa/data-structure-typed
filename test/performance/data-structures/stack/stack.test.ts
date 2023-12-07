import { Stack } from '../../../../src';
import { Stack as CStack } from 'js-sdsl';
import * as Benchmark from 'benchmark';
import { magnitude } from '../../../utils';
import { isCompetitor } from '../../../config';

const suite = new Benchmark.Suite();
const { LINEAR } = magnitude;

suite.add(`${LINEAR.toLocaleString()} push`, () => {
  const stack = new Stack<number>();

  for (let i = 0; i < LINEAR; i++) {
    stack.push(i);
  }
});
if (isCompetitor) {
  suite.add(`CPT ${LINEAR.toLocaleString()} push`, () => {
    const queue = new CStack<number>();

    for (let i = 0; i < LINEAR; i++) {
      queue.push(i);
    }
  });
}
suite.add(`${LINEAR.toLocaleString()} push & pop`, () => {
  const queue = new Stack<number>();

  for (let i = 0; i < LINEAR; i++) {
    queue.push(i);
  }
  for (let i = 0; i < LINEAR; i++) {
    queue.pop();
  }
});
if (isCompetitor) {
  suite.add(`CPT ${LINEAR.toLocaleString()} push & pop`, () => {
    const queue = new CStack<number>();

    for (let i = 0; i < LINEAR; i++) {
      queue.push(i);
    }
    for (let i = 0; i < LINEAR; i++) {
      queue.pop();
    }
  });
}

export { suite };
