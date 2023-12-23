import { PriorityQueue as MJSPriorityQueue } from '../../../../dist/cjs';
import { PriorityQueue as SRCPriorityQueue } from '../../../../src';
import { PriorityQueue as CJSPriorityQueue } from '../../../../dist/mjs';
import {
  Deque as CDeque,
  HashMap as CHashMap,
  LinkList as CLinkedList,
  OrderedMap,
  PriorityQueue as CPriorityQueue,
  Queue as CQueue,
  Stack as CStack
} from 'js-sdsl';

import * as Benchmark from 'benchmark';
import { getRandomIntArray, magnitude } from '../../../utils';
import { isCompetitor } from '../../../config';

const suite = new Benchmark.Suite();
const { TEN_THOUSAND, HUNDRED_THOUSAND, MILLION } = magnitude;
const cOrderedMap = new OrderedMap<number, number>();
const arrHundredThousand = getRandomIntArray(HUNDRED_THOUSAND, 0, HUNDRED_THOUSAND, true);

suite
  .add(`SRC PQ ${TEN_THOUSAND.toLocaleString()} add`, () => {
    const pq = new SRCPriorityQueue<number>();
    for (let i = 0; i < TEN_THOUSAND; i++) pq.add(i);
  })
  .add(`CJS PQ ${TEN_THOUSAND.toLocaleString()} add`, () => {
    const pq = new CJSPriorityQueue<number>();
    for (let i = 0; i < TEN_THOUSAND; i++) pq.add(i);
  })
  .add(`MJS PQ ${TEN_THOUSAND.toLocaleString()} add`, () => {
    const pq = new MJSPriorityQueue<number>([], { comparator: (a, b) => b - a });
    for (let i = 0; i < TEN_THOUSAND; i++) pq.add(i);
  });

if (isCompetitor) {
  suite.add(`CPT PQ ${TEN_THOUSAND.toLocaleString()} add`, () => {
    const pq = new CPriorityQueue<number>();
    for (let i = 0; i < TEN_THOUSAND; i++) pq.push(i);
  });
}

suite
  .add(`SRC PQ ${TEN_THOUSAND.toLocaleString()} add & poll`, () => {
    const pq = new SRCPriorityQueue<number>([], { comparator: (a, b) => b - a });

    for (let i = 0; i < TEN_THOUSAND; i++) pq.add(i);
    for (let i = 0; i < TEN_THOUSAND; i++) pq.poll();
  })
  .add(`CJS PQ ${TEN_THOUSAND.toLocaleString()} add & poll`, () => {
    const pq = new CJSPriorityQueue<number>([], { comparator: (a, b) => b - a });

    for (let i = 0; i < TEN_THOUSAND; i++) pq.add(i);
    for (let i = 0; i < TEN_THOUSAND; i++) pq.poll();
  })
  .add(`MJS PQ ${TEN_THOUSAND.toLocaleString()} add & poll`, () => {
    const pq = new MJSPriorityQueue<number>([], { comparator: (a, b) => b - a });

    for (let i = 0; i < TEN_THOUSAND; i++) pq.add(i);
    for (let i = 0; i < TEN_THOUSAND; i++) pq.poll();
  });

if (isCompetitor) {
  suite
    .add(`CPT PQ ${TEN_THOUSAND.toLocaleString()} add & pop`, () => {
      const pq = new CPriorityQueue<number>();

      for (let i = 0; i < TEN_THOUSAND; i++) pq.push(i);
      for (let i = 0; i < TEN_THOUSAND; i++) pq.pop();
    })
    .add(`CPT OM ${HUNDRED_THOUSAND.toLocaleString()} add`, () => {
      for (let i = 0; i < arrHundredThousand.length; i++)
        cOrderedMap.setElement(arrHundredThousand[i], arrHundredThousand[i]);
    })
    .add(`CPT HM ${TEN_THOUSAND.toLocaleString()} set`, () => {
      const hm = new CHashMap<number, number>();

      for (let i = 0; i < TEN_THOUSAND; i++) hm.setElement(i, i);
    })
    .add(`CPT HM ${TEN_THOUSAND.toLocaleString()} set & get`, () => {
      const hm = new CHashMap<number, number>();

      for (let i = 0; i < TEN_THOUSAND; i++) hm.setElement(i, i);
      for (let i = 0; i < TEN_THOUSAND; i++) hm.getElementByKey(i);
    })
    .add(`CPT LL ${MILLION.toLocaleString()} unshift`, () => {
      const list = new CLinkedList<number>();

      for (let i = 0; i < MILLION; i++) list.pushFront(i);
    })
    .add(`CPT PQ ${TEN_THOUSAND.toLocaleString()} add & pop`, () => {
      const pq = new CPriorityQueue<number>();

      for (let i = 0; i < TEN_THOUSAND; i++) pq.push(i);

      for (let i = 0; i < TEN_THOUSAND; i++) pq.pop();
    })
    .add(`CPT DQ ${MILLION.toLocaleString()} push`, () => {
      const deque = new CDeque<number>();
      for (let i = 0; i < MILLION; i++) deque.pushBack(i);
    })
    .add(`CPT Q ${MILLION.toLocaleString()} push`, () => {
      const queue = new CQueue<number>();

      for (let i = 0; i < MILLION; i++) queue.push(i);
    })
    .add(`CPT ST ${MILLION.toLocaleString()} push`, () => {
      const queue = new CStack<number>();

      for (let i = 0; i < MILLION; i++) queue.push(i);
    })
    .add(`CPT ST ${MILLION.toLocaleString()} push & pop`, () => {
      const queue = new CStack<number>();

      for (let i = 0; i < MILLION; i++) queue.push(i);
      for (let i = 0; i < MILLION; i++) queue.pop();
    });
}

// export { suite };
