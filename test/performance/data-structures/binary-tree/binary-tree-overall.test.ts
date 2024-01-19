import { AVLTree, RedBlackTree } from '../../../../src';
import * as Benchmark from 'benchmark';
import { getRandomIntArray, magnitude } from '../../../utils';

const suite = new Benchmark.Suite();
const rbTree = new RedBlackTree();
const avlTree = new AVLTree();
const { TEN_THOUSAND } = magnitude;
const arr = getRandomIntArray(TEN_THOUSAND, 0, TEN_THOUSAND - 1, true);

suite
  .add(`${TEN_THOUSAND.toLocaleString()} RBTree add randomly`, () => {
    rbTree.clear();
    for (let i = 0; i < arr.length; i++) rbTree.add(arr[i]);
  })
  .add(`${TEN_THOUSAND.toLocaleString()} RBTree get randomly`, () => {
    for (let i = 0; i < arr.length; i++) rbTree.get(arr[i]);
  })
  .add(`${TEN_THOUSAND.toLocaleString()} RBTree add & delete randomly`, () => {
    rbTree.clear();
    for (let i = 0; i < arr.length; i++) rbTree.add(arr[i]);
    for (let i = 0; i < arr.length; i++) rbTree.delete(arr[i]);
  })
  .add(`${TEN_THOUSAND.toLocaleString()} AVLTree add randomly`, () => {
    avlTree.clear();
    for (let i = 0; i < arr.length; i++) avlTree.add(arr[i]);
  })
  .add(`${TEN_THOUSAND.toLocaleString()} AVLTree get randomly`, () => {
    for (let i = 0; i < arr.length; i++) avlTree.get(arr[i]);
  })
  .add(`${TEN_THOUSAND.toLocaleString()} AVLTree add & delete randomly`, () => {
    avlTree.clear();
    for (let i = 0; i < arr.length; i++) avlTree.add(arr[i]);
    for (let i = 0; i < arr.length; i++) avlTree.delete(arr[i]);
  });

export { suite };
