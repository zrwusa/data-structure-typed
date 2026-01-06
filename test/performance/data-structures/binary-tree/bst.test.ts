import { BST } from '../../../../src';
import * as Benchmark from 'benchmark';
import { getRandomIntArray, magnitude } from '../../../utils';

const suite = new Benchmark.Suite();
const bst = new BST<number>();
const { TEN_THOUSAND } = magnitude;
const arr = getRandomIntArray(TEN_THOUSAND, 0, TEN_THOUSAND, true);

suite
  .add(`${TEN_THOUSAND.toLocaleString()} set randomly`, () => {
    bst.clear();
    for (let i = 0; i < arr.length; i++) bst.set(arr[i]);
  })
  .add(`${TEN_THOUSAND.toLocaleString()} set & delete randomly`, () => {
    bst.clear();
    for (let i = 0; i < arr.length; i++) bst.add(arr[i]);
    for (let i = 0; i < arr.length; i++) bst.delete(arr[i]);
  })
  .add(`${TEN_THOUSAND.toLocaleString()} setMany`, () => {
    bst.clear();
    bst.setMany(arr);
  })
  .add(`${TEN_THOUSAND.toLocaleString()} get`, () => {
    for (let i = 0; i < arr.length; i++) bst.get(arr[i]);
  });

// export { suite };
