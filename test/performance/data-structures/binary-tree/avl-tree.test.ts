import {AVLTree} from '../../../../src';
import * as Benchmark from 'benchmark';
import {getRandomIntArray, magnitude} from '../../../utils';

const suite = new Benchmark.Suite();
const avl = new AVLTree<number>();
const {TEN_THOUSAND} = magnitude;
const arr = getRandomIntArray(TEN_THOUSAND, 0, TEN_THOUSAND, true);

suite
  .add(`${TEN_THOUSAND.toLocaleString()} add randomly`, () => {
    avl.clear();
    for (let i = 0; i < arr.length; i++) {
      avl.add(arr[i]);
    }
  })
  .add(`${TEN_THOUSAND.toLocaleString()} add & delete randomly`, () => {
    avl.clear();
    for (let i = 0; i < arr.length; i++) {
      avl.add(arr[i]);
    }
    for (let i = 0; i < arr.length; i++) {
      avl.delete(arr[i]);
    }
  })
  .add(`${TEN_THOUSAND.toLocaleString()} addMany`, () => {
    avl.clear();
    avl.addMany(arr);
  })
  .add(`${TEN_THOUSAND.toLocaleString()} get`, () => {
    for (let i = 0; i < arr.length; i++) {
      avl.get(arr[i]);
    }
  });

export {suite};
