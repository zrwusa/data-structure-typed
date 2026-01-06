import { RedBlackTree } from '../../../../src';
import * as Benchmark from 'benchmark';
import { getRandomIntArray, magnitude } from '../../../utils';
import { OrderedMap } from 'js-sdsl';

const suite = new Benchmark.Suite();
const rbTree = new RedBlackTree<number>();
// const rbTreeNodeMode = new RedBlackTree<number>([], { isMapMode: false });

const { MILLION } = magnitude;
const randomArray = getRandomIntArray(MILLION, 0, MILLION - 1, true);
const cOrderedMap = new OrderedMap<number, number>();

suite
  // .add(`${MILLION.toLocaleString()} set randomly`, () => {
  //   rbTree.clear();
  //   for (let i = 0; i < randomArray.length; i++) rbTree.set(randomArray[i]);
  // })
  .add(`${MILLION.toLocaleString()} set`, () => {
    rbTree.clear();
    for (let i = 0; i < randomArray.length; i++) rbTree.set(i);
  })
  .add(`${MILLION.toLocaleString()} get`, () => {
    for (let i = 0; i < randomArray.length; i++) rbTree.get(randomArray[i]);
  })
  // .add(`${MILLION.toLocaleString()} getNode`, () => {
  //   for (let i = 0; i < randomArray.length; i++) rbTree.getNode(randomArray[i]);
  // })
  // .add(`${MILLION.toLocaleString()} node mode add randomly`, () => {
  //   rbTreeNodeMode.clear();
  //   for (let i = 0; i < randomArray.length; i++) rbTreeNodeMode.add(randomArray[i]);
  // })
  // .add(`${MILLION.toLocaleString()} node mode get`, () => {
  //   for (let i = 0; i < randomArray.length; i++) rbTreeNodeMode.get(randomArray[i]);
  // })
  .add(`${MILLION.toLocaleString()} iterator`, () => {
    const entries = [...rbTree];
    return entries.length === MILLION;
  });
// .add(`${MILLION.toLocaleString()} set & delete orderly`, () => {
//   rbTree.clear();
//   for (let i = 0; i < randomArray.length; i++) rbTree.set(i);
//   for (let i = 0; i < randomArray.length; i++) rbTree.delete(i);
// })
// .add(`${MILLION.toLocaleString()} set & delete randomly`, () => {
//   rbTree.clear();
//   for (let i = 0; i < randomArray.length; i++) rbTree.set(randomArray[i]);
//   for (let i = 0; i < randomArray.length; i++) rbTree.delete(randomArray[i]);
// });

if (true) {
  suite
    .add(`CPT ${MILLION.toLocaleString()} add`, () => {
      for (let i = 0; i < randomArray.length; i++) cOrderedMap.setElement(randomArray[i], randomArray[i]);
    })
    .add(`CPT ${MILLION.toLocaleString()} add`, () => {
      for (let i = 0; i < randomArray.length; i++) cOrderedMap.getElementByKey(randomArray[i]);
    });
}

export { suite };
