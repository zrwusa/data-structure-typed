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

// Minimal DLL - same structure as DST but minimal code
class MinimalDLLNode {
  constructor(value) {
    this.value = value;
    this.next = undefined;
    this.prev = undefined;
  }
}

class MinimalDLL {
  constructor() {
    this._head = undefined;
    this._tail = undefined;
    this._length = 0;
  }
  
  push(value) {
    const newNode = new MinimalDLLNode(value);
    if (!this._head) {
      this._head = newNode;
      this._tail = newNode;
    } else {
      newNode.prev = this._tail;
      this._tail.next = newNode;
      this._tail = newNode;
    }
    this._length++;
  }
  
  get length() { return this._length; }
}

// DST-like with instanceof check
class DSTLikeDLLNode {
  constructor(value) {
    this.value = value;
    this.next = undefined;
    this.prev = undefined;
  }
}

class DSTLikeDLL {
  constructor() {
    this._head = undefined;
    this._tail = undefined;
    this._length = 0;
    this._maxLen = 0;
  }
  
  push(elementOrNode) {
    const newNode = elementOrNode instanceof DSTLikeDLLNode 
      ? elementOrNode 
      : new DSTLikeDLLNode(elementOrNode);
    if (!this._head) {
      this._head = newNode;
      this._tail = newNode;
    } else {
      newNode.prev = this._tail;
      this._tail.next = newNode;
      this._tail = newNode;
    }
    this._length++;
    if (this._maxLen > 0 && this._length > this._maxLen) this.shift();
  }
  
  shift() {
    if (!this._head) return;
    this._head = this._head.next;
    if (this._head) this._head.prev = undefined;
    this._length--;
  }
  
  get length() { return this._length; }
}

console.log(`\n=== Deep DST Analysis ===`);
console.log(`N = ${N.toLocaleString()}, ITERATIONS = ${ITERATIONS}\n`);

const results = [];

results.push(benchmark('js-sdsl LinkList', () => {
  const list = new LinkList();
  for (let i = 0; i < N; i++) list.pushBack(i);
}));

results.push(benchmark('Minimal DLL (baseline)', () => {
  const list = new MinimalDLL();
  for (let i = 0; i < N; i++) list.push(i);
}));

results.push(benchmark('DST-like (instanceof+maxLen)', () => {
  const list = new DSTLikeDLL();
  for (let i = 0; i < N; i++) list.push(i);
}));

results.push(benchmark('Real DST DoublyLinkedList', () => {
  const list = new DoublyLinkedList();
  for (let i = 0; i < N; i++) list.push(i);
}));

console.log('| Implementation | Avg (ms) | vs js-sdsl |');
console.log('|----------------|----------|------------|');
const sdslTime = results[0].avg;
for (const r of results) {
  const ratio = (r.avg / sdslTime).toFixed(2);
  console.log(`| ${r.name.padEnd(30)} | ${r.avg.toFixed(2).padStart(8)} | ${ratio.padStart(10)}x |`);
}
