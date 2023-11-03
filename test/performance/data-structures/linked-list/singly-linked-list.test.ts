import {SinglyLinkedList, SinglyLinkedListNode} from '../../../../src';
import * as Benchmark from 'benchmark';
import {magnitude} from '../../../utils';

const suite = new Benchmark.Suite();
const {N_LOG_N} = magnitude;

suite
  .add(`${N_LOG_N} push & pop`, () => {
    const list = new SinglyLinkedList<number>();

    for (let i = 0; i < N_LOG_N; i++) {
      list.push(i);
    }

    for (let i = 0; i < N_LOG_N; i++) {
      list.pop();
    }
  })
  .add(`${N_LOG_N} insertBefore`, () => {
    const singlyList = new SinglyLinkedList<number>();
    let midSinglyNode: SinglyLinkedListNode | null = null;
    const midIndex = Math.floor(N_LOG_N / 2);
    for (let i = 0; i < N_LOG_N; i++) {
      singlyList.push(i);
      if (i === midIndex) {
        midSinglyNode = singlyList.getNode(i);
      } else if (i > midIndex && midSinglyNode) {
        singlyList.insertBefore(midSinglyNode.value, i);
      }
    }
  });

export {suite};
