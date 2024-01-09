import { Heap } from '../../../../src';
import * as Benchmark from 'benchmark';
import { getRandomInt, magnitude } from '../../../utils';

const suite = new Benchmark.Suite();
const { HUNDRED_THOUSAND } = magnitude;
const indicesHT = new Array(HUNDRED_THOUSAND).fill(0).map(() => getRandomInt(0, HUNDRED_THOUSAND - 1));

suite
  .add(`${HUNDRED_THOUSAND.toLocaleString()} add`, () => {
    const heap = new Heap<number>([], { comparator: (a, b) => b - a });
    for (let i = 0; i < HUNDRED_THOUSAND; i++) heap.add(indicesHT[i]);
  })
  .add(`${HUNDRED_THOUSAND.toLocaleString()} add & poll`, () => {
    const heap = new Heap<number>([], { comparator: (a, b) => b - a });

    for (let i = 0; i < HUNDRED_THOUSAND; i++) heap.add(indicesHT[i]);
    for (let i = 0; i < HUNDRED_THOUSAND; i++) heap.poll();
  });
// .add(`${TEN_THOUSAND.toLocaleString()} fib add & pop`, () => {
//   const fbHeap = new FibonacciHeap<number>();
//   for (let i = 1; i <= TEN_THOUSAND; i++) fbHeap.push(i);
//   for (let i = 1; i <= TEN_THOUSAND; i++) fbHeap.pop();
// });

export { suite };
