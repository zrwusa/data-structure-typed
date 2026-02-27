import { DoublyLinkedList } from '../../dist/esm/index.mjs';
import { LinkList } from 'js-sdsl';

const N = 100_000;
const ITERATIONS = 20;

function benchmark(name, fn) {
  for (let w = 0; w < 3; w++) fn();
  const times = [];
  for (let i = 0; i < ITERATIONS; i++) {
    const start = performance.now();
    fn();
    times.push(performance.now() - start);
  }
  return { name, avg: times.reduce((a, b) => a + b, 0) / times.length };
}

// 普通方式 (null check)
class NormalNode {
  constructor(v) { this.value = v; this.next = undefined; this.prev = undefined; }
}

class NormalDLL {
  constructor() {
    this._head = undefined;
    this._tail = undefined;
    this._length = 0;
  }
  
  push(value) {
    const n = new NormalNode(value);
    if (!this._head) {
      this._head = n;
      this._tail = n;
    } else {
      n.prev = this._tail;
      this._tail.next = n;
      this._tail = n;
    }
    this._length++;
  }
  
  unshift(value) {
    const n = new NormalNode(value);
    if (!this._head) {
      this._head = n;
      this._tail = n;
    } else {
      n.next = this._head;
      this._head.prev = n;
      this._head = n;
    }
    this._length++;
  }
}

// Sentinel 方式 (like js-sdsl)
class SentinelDLL {
  constructor() {
    // sentinel node - circular
    this._sentinel = { value: undefined, next: undefined, prev: undefined };
    this._sentinel.next = this._sentinel;
    this._sentinel.prev = this._sentinel;
    this._length = 0;
  }
  
  push(value) {
    const tail = this._sentinel.prev;
    const n = { value, prev: tail, next: this._sentinel };
    tail.next = n;
    this._sentinel.prev = n;
    this._length++;
  }
  
  unshift(value) {
    const head = this._sentinel.next;
    const n = { value, prev: this._sentinel, next: head };
    this._sentinel.next = n;
    head.prev = n;
    this._length++;
  }
  
  get first() { return this._length > 0 ? this._sentinel.next.value : undefined; }
  get last() { return this._length > 0 ? this._sentinel.prev.value : undefined; }
}

// Sentinel with class nodes
class SentinelNodeDLL {
  constructor() {
    this._sentinel = new NormalNode(undefined);
    this._sentinel.next = this._sentinel;
    this._sentinel.prev = this._sentinel;
    this._length = 0;
  }
  
  push(value) {
    const tail = this._sentinel.prev;
    const n = new NormalNode(value);
    n.prev = tail;
    n.next = this._sentinel;
    tail.next = n;
    this._sentinel.prev = n;
    this._length++;
  }
  
  unshift(value) {
    const head = this._sentinel.next;
    const n = new NormalNode(value);
    n.prev = this._sentinel;
    n.next = head;
    this._sentinel.next = n;
    head.prev = n;
    this._length++;
  }
}

console.log(`\n=== Sentinel vs Normal Pattern ===`);
console.log(`N = ${N.toLocaleString()}, ITERATIONS = ${ITERATIONS}\n`);

const results = [];

results.push(benchmark('js-sdsl LinkList', () => {
  const list = new LinkList();
  for (let i = 0; i < N; i++) list.pushBack(i);
}));

results.push(benchmark('Sentinel (plain obj)', () => {
  const list = new SentinelDLL();
  for (let i = 0; i < N; i++) list.push(i);
}));

results.push(benchmark('Sentinel (class node)', () => {
  const list = new SentinelNodeDLL();
  for (let i = 0; i < N; i++) list.push(i);
}));

results.push(benchmark('Normal (null check)', () => {
  const list = new NormalDLL();
  for (let i = 0; i < N; i++) list.push(i);
}));

results.push(benchmark('DST DoublyLinkedList', () => {
  const list = new DoublyLinkedList();
  for (let i = 0; i < N; i++) list.push(i);
}));

console.log('| Implementation | Avg (ms) | vs js-sdsl |');
console.log('|----------------|----------|------------|');
const sdslTime = results[0].avg;
for (const r of results) {
  const ratio = (r.avg / sdslTime).toFixed(2);
  console.log(`| ${r.name.padEnd(22)} | ${r.avg.toFixed(2).padStart(8)} | ${ratio.padStart(10)}x |`);
}

// Also test unshift
console.log(`\n--- Unshift Test ---\n`);

const unshiftResults = [];

unshiftResults.push(benchmark('js-sdsl pushFront', () => {
  const list = new LinkList();
  for (let i = 0; i < N; i++) list.pushFront(i);
}));

unshiftResults.push(benchmark('Sentinel unshift', () => {
  const list = new SentinelDLL();
  for (let i = 0; i < N; i++) list.unshift(i);
}));

unshiftResults.push(benchmark('Normal unshift', () => {
  const list = new NormalDLL();
  for (let i = 0; i < N; i++) list.unshift(i);
}));

unshiftResults.push(benchmark('DST unshift', () => {
  const list = new DoublyLinkedList();
  for (let i = 0; i < N; i++) list.unshift(i);
}));

console.log('| Implementation | Avg (ms) | vs js-sdsl |');
console.log('|----------------|----------|------------|');
const sdslUnshiftTime = unshiftResults[0].avg;
for (const r of unshiftResults) {
  const ratio = (r.avg / sdslUnshiftTime).toFixed(2);
  console.log(`| ${r.name.padEnd(22)} | ${r.avg.toFixed(2).padStart(8)} | ${ratio.padStart(10)}x |`);
}
