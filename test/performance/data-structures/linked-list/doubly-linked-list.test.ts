import {DoublyLinkedList, DoublyLinkedListNode} from '../../../../src';
import * as Benchmark from 'benchmark';
import {magnitude} from '../../../utils';

const suite = new Benchmark.Suite();
const {LINEAR, N_LOG_N} = magnitude;

suite
  .add(`unshift ${LINEAR}`, () => {
    const list = new DoublyLinkedList<number>();

    for (let i = 0; i < LINEAR; i++) {
      list.unshift(i);
    }
  })
  .add(`unshift & shift ${LINEAR}`, () => {
    const list = new DoublyLinkedList<number>();

    for (let i = 0; i < LINEAR; i++) {
      list.unshift(i);
    }
    for (let i = 0; i < LINEAR; i++) {
      list.shift();
    }
  })
  .add(`insertBefore ${N_LOG_N}`, () => {
    const doublyList = new DoublyLinkedList<number>();
    let midNode: DoublyLinkedListNode | null = null;
    const midIndex = Math.floor(N_LOG_N / 2);
    for (let i = 0; i < N_LOG_N; i++) {
      doublyList.push(i);
      if (i === midIndex) {
        midNode = doublyList.getNode(i);
      } else if (i > midIndex && midNode) {
        doublyList.insertBefore(midNode, i);
      }
    }
  });

export {suite};
