import { RedBlackTree } from '../../../../src';
import * as Benchmark from 'benchmark';
import { getRandomIntArray, magnitude } from '../../../utils';
import { OrderedMap } from 'js-sdsl';
import { isCompetitor } from '../../../config';

const suite = new Benchmark.Suite();
const rbTree = new RedBlackTree();
const { HUNDRED_THOUSAND } = magnitude;
const arr = getRandomIntArray(HUNDRED_THOUSAND, 0, HUNDRED_THOUSAND, true);
const cOrderedMap = new OrderedMap<number, number>();

suite.add(`${HUNDRED_THOUSAND.toLocaleString()} add`, () => {
  rbTree.clear();
  for (let i = 0; i < arr.length; i++) {
    rbTree.add(arr[i]);
  }
});

if (isCompetitor) {
  suite.add(`${HUNDRED_THOUSAND.toLocaleString()} CPT add`, () => {
    for (let i = 0; i < arr.length; i++) {
      cOrderedMap.setElement(arr[i], arr[i]);
    }
  });
}

suite
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

suite.add(`${HUNDRED_THOUSAND.toLocaleString()} add & iterator`, () => {
  rbTree.clear();
  for (let i = 0; i < arr.length; i++) rbTree.add(arr[i]);
  const entries = [...rbTree];
  return entries.length === HUNDRED_THOUSAND
});

export { suite };
