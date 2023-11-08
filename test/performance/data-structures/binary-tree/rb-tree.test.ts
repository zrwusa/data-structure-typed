import {RedBlackTree} from '../../../../src';
import * as Benchmark from 'benchmark';
import {getRandomIntArray, magnitude} from '../../../utils';

const suite = new Benchmark.Suite();
const rbTree = new RedBlackTree();
const {HUNDRED_THOUSAND} = magnitude;
const arr = getRandomIntArray(HUNDRED_THOUSAND, 0, HUNDRED_THOUSAND, true);

suite
  .add(`${HUNDRED_THOUSAND.toLocaleString()} add randomly`, () => {
    rbTree.clear();
    for (let i = 0; i < arr.length; i++) {
      rbTree.add(arr[i]);
    }
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} add & delete randomly`, () => {
    rbTree.clear();
    for (let i = 0; i < arr.length; i++) {
      rbTree.add(arr[i]);
    }
    for (let i = 0; i < arr.length; i++) {
      rbTree.delete(arr[i]);
    }
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} getNode`, () => {
    for (let i = 0; i < arr.length; i++) {
      rbTree.getNode(arr[i]);
    }
  });

export {suite};
