import {BinaryTree} from '../../../../src';

import * as Benchmark from 'benchmark';

export const suite = new Benchmark.Suite();
const bt = new BinaryTree<number>();

suite
  .add('add 1000', () => {
    for (let i = 0; i < 1000; i++) {
      bt.add(i);
    }
  })
  .add('add & delete 1000', () => {
    for (let i = 0; i < 1000; i++) {
      bt.delete(i);
    }
  });
