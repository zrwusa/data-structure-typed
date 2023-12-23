import { SinglyLinkedList, SinglyLinkedListNode } from '../../../../src';
import * as Benchmark from 'benchmark';
import { magnitude } from '../../../utils';

const suite = new Benchmark.Suite();
const { MILLION, TEN_THOUSAND } = magnitude;

suite
  .add(`${MILLION.toLocaleString()} push & shift`, () => {
    const list = new SinglyLinkedList<number>();

    for (let i = 0; i < MILLION; i++) list.push(i);
    for (let i = 0; i < MILLION; i++) list.shift();
  })
  .add(`${TEN_THOUSAND.toLocaleString()} push & pop`, () => {
    const list = new SinglyLinkedList<number>();

    for (let i = 0; i < TEN_THOUSAND; i++) list.push(i);
    for (let i = 0; i < TEN_THOUSAND; i++) list.pop();
  })
  .add(`${TEN_THOUSAND.toLocaleString()} addBefore`, () => {
    const singlyList = new SinglyLinkedList<number>();
    let midSinglyNode: SinglyLinkedListNode | undefined;
    const midIndex = Math.floor(TEN_THOUSAND / 2);
    for (let i = 0; i < TEN_THOUSAND; i++) {
      singlyList.push(i);
      if (i === midIndex) {
        midSinglyNode = singlyList.getNode(i);
      } else if (i > midIndex && midSinglyNode) {
        singlyList.addBefore(midSinglyNode.value, i);
      }
    }
  });

export { suite };
