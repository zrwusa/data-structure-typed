import { RedBlackTree } from '../../../../src';
import * as Benchmark from 'benchmark';
import { getRandomIntArray, magnitude } from '../../../utils';
import { OrderedMap } from 'js-sdsl';
import { isCompetitor } from '../../../config';

const suite = new Benchmark.Suite();
const rbTree = new RedBlackTree();
const { HUNDRED_THOUSAND } = magnitude;
const randomArray = getRandomIntArray(HUNDRED_THOUSAND, 0, HUNDRED_THOUSAND - 1, true);
const cOrderedMap = new OrderedMap<number, number>();

suite
  .add(`${HUNDRED_THOUSAND.toLocaleString()} add`, () => {
    rbTree.clear();
    for (let i = 0; i < randomArray.length; i++) rbTree.add(i);
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} add randomly`, () => {
    rbTree.clear();
    for (let i = 0; i < randomArray.length; i++) rbTree.add(randomArray[i]);
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} get`, () => {
    for (let i = 0; i < randomArray.length; i++) rbTree.get(randomArray[i]);
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} iterator`, () => {
    const entries = [...rbTree];
    return entries.length === HUNDRED_THOUSAND;
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} add & delete orderly`, () => {
    rbTree.clear();
    for (let i = 0; i < randomArray.length; i++) rbTree.add(i);
    for (let i = 0; i < randomArray.length; i++) rbTree.delete(i);
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} add & delete randomly`, () => {
    rbTree.clear();
    for (let i = 0; i < randomArray.length; i++) rbTree.add(randomArray[i]);
    for (let i = 0; i < randomArray.length; i++) rbTree.delete(randomArray[i]);
  });

if (isCompetitor) {
  suite.add(`CPT ${HUNDRED_THOUSAND.toLocaleString()} add`, () => {
    for (let i = 0; i < randomArray.length; i++) cOrderedMap.setElement(randomArray[i], randomArray[i]);
  });
}

export { suite };
