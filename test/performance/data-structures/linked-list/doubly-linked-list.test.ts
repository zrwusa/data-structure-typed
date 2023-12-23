import { DoublyLinkedList, DoublyLinkedListNode } from '../../../../src';
import { LinkList as CLinkedList } from 'js-sdsl';
import * as Benchmark from 'benchmark';
import { magnitude } from '../../../utils';
import { isCompetitor } from '../../../config';

const suite = new Benchmark.Suite();
const { MILLION } = magnitude;

suite.add(`${MILLION.toLocaleString()} push`, () => {
  const list = new DoublyLinkedList<number>();

  for (let i = 0; i < MILLION; i++) list.push(i);
});

if (isCompetitor) {
  suite.add(`CPT ${MILLION.toLocaleString()} push`, () => {
    const list = new CLinkedList<number>();

    for (let i = 0; i < MILLION; i++) list.pushBack(i);
  });
}

suite.add(`${MILLION.toLocaleString()} unshift`, () => {
  const list = new DoublyLinkedList<number>();

  for (let i = 0; i < MILLION; i++) list.unshift(i);
});

if (isCompetitor) {
  suite.add(`CPT ${MILLION.toLocaleString()} unshift`, () => {
    const list = new CLinkedList<number>();

    for (let i = 0; i < MILLION; i++) list.pushFront(i);
  });
}

suite
  .add(`${MILLION.toLocaleString()} unshift & shift`, () => {
    const list = new DoublyLinkedList<number>();

    for (let i = 0; i < MILLION; i++) list.unshift(i);
    for (let i = 0; i < MILLION; i++) list.shift();
  })
  .add(`${MILLION.toLocaleString()} addBefore`, () => {
    const doublyList = new DoublyLinkedList<number>();
    let midNode: DoublyLinkedListNode | undefined;
    const midIndex = Math.floor(MILLION / 2);
    for (let i = 0; i < MILLION; i++) {
      doublyList.push(i);
      if (i === midIndex) {
        midNode = doublyList.getNode(i);
      } else if (i > midIndex && midNode) {
        doublyList.addBefore(midNode, i);
      }
    }
  });

export { suite };
