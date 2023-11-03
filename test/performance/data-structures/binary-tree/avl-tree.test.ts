import {AVLTree} from '../../../../src';
import * as Benchmark from 'benchmark';
import {getRandomIntArray, magnitude} from '../../../utils';

const suite = new Benchmark.Suite();
const avl = new AVLTree<number>();
const {N_LOG_N} = magnitude;
const arr = getRandomIntArray(N_LOG_N, 0, N_LOG_N, true);

suite
  .add(`${N_LOG_N} add randomly`, () => {
    avl.clear();
    for (let i = 0; i < arr.length; i++) {
      avl.add(arr[i]);
    }
  })
  .add(`${N_LOG_N} add & delete randomly`, () => {
    avl.clear();
    for (let i = 0; i < arr.length; i++) {
      avl.add(arr[i]);
    }
    for (let i = 0; i < arr.length; i++) {
      avl.delete(arr[i]);
    }
  })
  .add(`${N_LOG_N} addMany`, () => {
    avl.clear();
    avl.addMany(arr);
  })
  .add(`${N_LOG_N} get`, () => {
    for (let i = 0; i < arr.length; i++) {
      avl.get(arr[i]);
    }
  });

export {suite};
