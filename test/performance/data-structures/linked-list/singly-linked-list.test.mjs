import { SinglyLinkedList } from '../../../../dist/esm/index.mjs';
import Benchmark from 'benchmark';
import { magnitude } from '../../../utils/index.mjs';

const suite = new Benchmark.Suite();
const { HUNDRED_THOUSAND, TEN_THOUSAND } = magnitude;

// Head operations (unshift/shift) - O(1) for SinglyLinkedList, fair comparison with std::forward_list

suite.add('100K unshift & shift', function() {
  const list = new SinglyLinkedList();
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    list.unshift(i);
  }
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    list.shift();
  }
  this.val = list;
});

suite.add('Native JS Array 100K unshift & shift', function() {
  const arr = [];
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    arr.unshift(i);
  }
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    arr.shift();
  }
  this.val = arr;
});

suite.add('10K unshift & shift', function() {
  const list = new SinglyLinkedList();
  for (let i = 0; i < TEN_THOUSAND; i++) {
    list.unshift(i);
  }
  for (let i = 0; i < TEN_THOUSAND; i++) {
    list.shift();
  }
  this.val = list;
});

suite.add('Native JS Array 10K unshift & shift', function() {
  const arr = [];
  for (let i = 0; i < TEN_THOUSAND; i++) {
    arr.unshift(i);
  }
  for (let i = 0; i < TEN_THOUSAND; i++) {
    arr.shift();
  }
  this.val = arr;
});

// Index-based insertion (O(n) operation)
suite.add('10K addAt(mid)', function() {
  const list = new SinglyLinkedList();
  for (let i = 0; i < TEN_THOUSAND; i++) {
    list.push(i);
  }

  const midIndex = Math.floor(TEN_THOUSAND / 2);
  for (let i = 0; i < TEN_THOUSAND / 10; i++) {
    list.addAt(midIndex, i);
  }

  this.val = list;
});

// Cursor-based insertion (O(1) with known position)
suite.add('10K addBefore (cursor)', function() {
  const list = new SinglyLinkedList();
  for (let i = 0; i < TEN_THOUSAND; i++) {
    list.push(i);
  }

  const cursor = list.getNodeAt(Math.floor(TEN_THOUSAND / 2));
  for (let i = 0; i < TEN_THOUSAND / 10; i++) {
    list.addBefore(cursor, i);
  }

  this.val = list;
});

export { suite };
