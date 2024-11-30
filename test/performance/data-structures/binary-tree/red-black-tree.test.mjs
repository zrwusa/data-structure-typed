import { RedBlackTree } from 'data-structure-typed';
import Benchmark from 'benchmark';

const magnitude = {
  THOUSAND: 1000,
  TEN_THOUSAND: 10000,
  HUNDRED_THOUSAND: 100000,
  MILLION: 1000000,
  TEN_MILLION: 10000000,
  BILLION: 100000000
};

function getRandomIntArray(length = 1000, min = -1000, max = 1000, unique = true) {
  if (unique) {
    if (max - min + 1 < length) {
      throw new Error('Range too small for unique values with the specified length');
    }
    const allNumbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);
    for (let i = allNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allNumbers[i], allNumbers[j]] = [allNumbers[j], allNumbers[i]];
    }
    return allNumbers.slice(0, length);
  }
  else {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  }
}
const suite = new Benchmark.Suite();
const rbTree = new RedBlackTree();
const rbTreeNodeMode = new RedBlackTree([], { isMapMode: false });
const { HUNDRED_THOUSAND } = magnitude;
const randomArray = getRandomIntArray(HUNDRED_THOUSAND, 0, HUNDRED_THOUSAND - 1, true);
suite
  .add(`${HUNDRED_THOUSAND.toLocaleString()} add randomly`, () => {
    rbTree.clear();
    for (let i = 0; i < randomArray.length; i++)
      rbTree.add(randomArray[i]);
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} add`, () => {
    rbTree.clear();
    for (let i = 0; i < randomArray.length; i++)
      rbTree.add(i);
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} get`, () => {
    for (let i = 0; i < randomArray.length; i++)
      rbTree.get(randomArray[i]);
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} getNode`, () => {
    for (let i = 0; i < randomArray.length; i++)
      rbTree.getNode(randomArray[i]);
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} node mode add randomly`, () => {
    rbTreeNodeMode.clear();
    for (let i = 0; i < randomArray.length; i++)
      rbTreeNodeMode.add(randomArray[i]);
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} node mode get`, () => {
    for (let i = 0; i < randomArray.length; i++)
      rbTreeNodeMode.get(randomArray[i]);
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} iterator`, () => {
    const entries = [...rbTree];
    return entries.length === HUNDRED_THOUSAND;
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} add & delete orderly`, () => {
    rbTree.clear();
    for (let i = 0; i < randomArray.length; i++)
      rbTree.add(i);
    for (let i = 0; i < randomArray.length; i++)
      rbTree.delete(i);
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} add & delete randomly`, () => {
    rbTree.clear();
    for (let i = 0; i < randomArray.length; i++)
      rbTree.add(randomArray[i]);
    for (let i = 0; i < randomArray.length; i++)
      rbTree.delete(randomArray[i]);
  });

export { suite };
