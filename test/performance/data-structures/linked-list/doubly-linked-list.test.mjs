import { DoublyLinkedList } from '../../../../dist/esm/index.mjs';
import { LinkList as SdslLinkList } from 'js-sdsl';
import Benchmark from 'benchmark';
import { magnitude } from '../../../utils/perf.mjs';

const suite = new Benchmark.Suite();
const { HUNDRED_THOUSAND } = magnitude;

// NOTE: Avoid mutating a global list in a benchmark case.
// Benchmark.js will call the test function many times, so a global list would grow and
// slow down over time, distorting results.

suite.add('100k push', function() {
  const list = new DoublyLinkedList();
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    list.push(i);
  }
  this.val = list;
});

suite.add('Native JS Array 100k push', function() {
  const arr = [];
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    arr.push(i);
  }
  this.val = arr;
});

suite.add('100k unshift', function() {
  const list = new DoublyLinkedList();
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    list.unshift(i);
  }
  this.val = list;
});

suite.add('Native JS Array 100k unshift', function() {
  const arr = [];
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    arr.unshift(i);
  }
  this.val = arr;
});

suite.add('100k unshift & shift', function() {
  const list = new DoublyLinkedList();
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    list.unshift(i);
  }
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    list.shift();
  }
  this.val = list;
});

suite.add('Native JS Array 100k unshift & shift', function() {
  const arr = [];
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    arr.unshift(i);
  }
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    arr.shift();
  }
  this.val = arr;
});

suite.add('100k addAt(mid)', function() {
  const list = new DoublyLinkedList();
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    list.push(i);
  }

  const midIndex = Math.floor(HUNDRED_THOUSAND / 2);
  for (let i = 0; i < HUNDRED_THOUSAND / 10; i++) {
    list.addAt(midIndex, i);
  }

  this.val = list;
});

// Cursor-based insertion: comparable to C++ std::list::insert(it, value)
// (known position insertion without paying index-to-node lookup each time)
suite.add('100k addBefore (cursor)', function() {
  const list = new DoublyLinkedList();
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    list.push(i);
  }

  const cursor = list.getNodeAt(Math.floor(HUNDRED_THOUSAND / 2));
  for (let i = 0; i < HUNDRED_THOUSAND / 10; i++) {
    list.addBefore(cursor, i);
  }

  this.val = list;
});

// js-sdsl LinkList comparison
suite.add('100k push (js-sdsl)', function() {
  const list = new SdslLinkList();
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    list.pushBack(i);
  }
  this.val = list;
});

suite.add('100k unshift (js-sdsl)', function() {
  const list = new SdslLinkList();
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    list.pushFront(i);
  }
  this.val = list;
});

suite.add('100k unshift & shift (js-sdsl)', function() {
  const list = new SdslLinkList();
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    list.pushFront(i);
  }
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    list.popFront();
  }
  this.val = list;
});

export { suite };
