import {BST} from '../../../../src';
import * as Benchmark from 'benchmark';
import {getRandomIntArray, magnitude} from '../../../utils';

const suite = new Benchmark.Suite();
const bst = new BST<number>();
const {N_LOG_N} = magnitude;
const arr = getRandomIntArray(N_LOG_N, 0, N_LOG_N, true);

suite
  .add(`${N_LOG_N} add randomly`, () => {
    bst.clear();
    for (let i = 0; i < arr.length; i++) {
      bst.add(arr[i]);
    }
  })
  .add(`${N_LOG_N} add & delete randomly`, () => {
    bst.clear();
    for (let i = 0; i < arr.length; i++) {
      bst.add(arr[i]);
    }
    for (let i = 0; i < arr.length; i++) {
      bst.delete(arr[i]);
    }
  })
  .add(`${N_LOG_N} addMany`, () => {
    bst.clear();
    bst.addMany(arr);
  })
  .add(`${N_LOG_N} get`, () => {
    for (let i = 0; i < arr.length; i++) {
      bst.get(arr[i]);
    }
  });

export {suite};
