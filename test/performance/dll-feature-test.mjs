import { DoublyLinkedList, DoublyLinkedListNode } from '../../dist/esm/index.mjs';

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

// Minimal implementation
class MinNode {
  constructor(value) {
    this.value = value;
    this.next = undefined;
    this.prev = undefined;
  }
}

class MinDLL {
  constructor() {
    this._head = undefined;
    this._tail = undefined;
    this._length = 0;
  }
  
  push(value) {
    const n = new MinNode(value);
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
}

// Add getter for head/tail (like DST)
class WithGettersDLL {
  constructor() {
    this.__head = undefined;
    this.__tail = undefined;
    this._length = 0;
  }
  
  get head() { return this.__head; }
  get tail() { return this.__tail; }
  
  push(value) {
    const n = new MinNode(value);
    if (!this.head) {
      this.__head = n;
      this.__tail = n;
    } else {
      n.prev = this.tail;
      this.tail.next = n;
      this.__tail = n;
    }
    this._length++;
  }
}

// Add isNode check (like DST _ensureNode)
class WithIsNodeDLL {
  constructor() {
    this._head = undefined;
    this._tail = undefined;
    this._length = 0;
  }
  
  isNode(v) {
    return v instanceof MinNode;
  }
  
  push(elementOrNode) {
    const n = this.isNode(elementOrNode) ? elementOrNode : new MinNode(elementOrNode);
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
}

// Using DST's DoublyLinkedListNode
class WithDSTNodeDLL {
  constructor() {
    this._head = undefined;
    this._tail = undefined;
    this._length = 0;
  }
  
  push(value) {
    const n = new DoublyLinkedListNode(value);
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
}

console.log(`\n=== DST Feature Impact Analysis ===`);
console.log(`N = ${N.toLocaleString()}, ITERATIONS = ${ITERATIONS}\n`);

const results = [];

results.push(benchmark('Minimal (baseline)', () => {
  const list = new MinDLL();
  for (let i = 0; i < N; i++) list.push(i);
}));

results.push(benchmark('With head/tail getters', () => {
  const list = new WithGettersDLL();
  for (let i = 0; i < N; i++) list.push(i);
}));

results.push(benchmark('With isNode check', () => {
  const list = new WithIsNodeDLL();
  for (let i = 0; i < N; i++) list.push(i);
}));

results.push(benchmark('Using DST Node class', () => {
  const list = new WithDSTNodeDLL();
  for (let i = 0; i < N; i++) list.push(i);
}));

results.push(benchmark('Real DST DoublyLinkedList', () => {
  const list = new DoublyLinkedList();
  for (let i = 0; i < N; i++) list.push(i);
}));

console.log('| Feature | Avg (ms) | vs Baseline |');
console.log('|---------|----------|-------------|');
const baseTime = results[0].avg;
for (const r of results) {
  const ratio = (r.avg / baseTime).toFixed(2);
  console.log(`| ${r.name.padEnd(25)} | ${r.avg.toFixed(2).padStart(8)} | ${ratio.padStart(11)}x |`);
}
