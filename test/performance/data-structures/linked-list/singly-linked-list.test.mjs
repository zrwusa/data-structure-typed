import { SinglyLinkedList } from '../../../../dist/esm/index.mjs';
import Benchmark from 'benchmark';
import { magnitude } from '../../../utils/index.mjs';

const suite = new Benchmark.Suite();
const { HUNDRED_THOUSAND, TEN_THOUSAND } = magnitude;

// NOTE: Avoid mutating a global list in a benchmark case.
// Benchmark.js will call the test function many times, so a global list would grow and
// slow down over time, distorting results.

suite.add('100k push & shift', function() {
  const list = new SinglyLinkedList();
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    list.push(i);
  }
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    list.shift();
  }
  this.val = list;
});

suite.add('Native JS Array 100k push & shift', function() {
  const arr = [];
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    arr.push(i);
  }
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    arr.shift();
  }
  this.val = arr;
});

suite.add('10K push & pop', function() {
  const list = new SinglyLinkedList();
  for (let i = 0; i < TEN_THOUSAND; i++) {
    list.push(i);
  }
  for (let i = 0; i < TEN_THOUSAND; i++) {
    list.pop();
  }
  this.val = list;
});

suite.add('Native JS Array 10K push & pop', function() {
  const arr = [];
  for (let i = 0; i < TEN_THOUSAND; i++) {
    arr.push(i);
  }
  for (let i = 0; i < TEN_THOUSAND; i++) {
    arr.pop();
  }
  this.val = arr;
});

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

// Cursor-based insertion (known position insertion)
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
