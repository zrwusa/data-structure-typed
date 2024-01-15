import { AVLTree } from '../../../../src';
import * as Benchmark from 'benchmark';
import { getRandomIntArray, magnitude } from '../../../utils';

const suite = new Benchmark.Suite();
const avlTree = new AVLTree<number>();
const { HUNDRED_THOUSAND } = magnitude;
const randomArray = getRandomIntArray(HUNDRED_THOUSAND, 0, HUNDRED_THOUSAND - 1, true);

suite
  .add(`${HUNDRED_THOUSAND.toLocaleString()} add`, () => {
    avlTree.clear();
    for (let i = 0; i < randomArray.length; i++) avlTree.add(i);
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} add randomly`, () => {
    avlTree.clear();
    for (let i = 0; i < randomArray.length; i++) avlTree.add(randomArray[i]);
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} get`, () => {
    for (let i = 0; i < randomArray.length; i++) avlTree.get(randomArray[i]);
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} iterator`, () => {
    const entries = [...avlTree];
    return entries.length === HUNDRED_THOUSAND;
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} add & delete orderly`, () => {
    avlTree.clear();
    for (let i = 0; i < randomArray.length; i++) avlTree.add(i);
    for (let i = 0; i < randomArray.length; i++) avlTree.delete(i);
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} add & delete randomly`, () => {
    avlTree.clear();
    for (let i = 0; i < randomArray.length; i++) avlTree.add(randomArray[i]);
    for (let i = 0; i < randomArray.length; i++) avlTree.delete(randomArray[i]);
  });

export { suite };
