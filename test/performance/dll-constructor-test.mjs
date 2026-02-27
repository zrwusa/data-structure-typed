import { DoublyLinkedList } from '../../dist/esm/index.mjs';

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

// Minimal constructor (no pushMany)
class MinNode {
  constructor(v) { this.value = v; this.next = undefined; this.prev = undefined; }
}

class MinDLL {
  constructor() {
    this._head = undefined;
    this._tail = undefined;
    this._length = 0;
  }
  push(value) {
    const n = new MinNode(value);
    if (!this._head) { this._head = n; this._tail = n; }
    else { n.prev = this._tail; this._tail.next = n; this._tail = n; }
    this._length++;
  }
}

// With pushMany in constructor
class WithPushManyDLL {
  constructor(elements = []) {
    this._head = undefined;
    this._tail = undefined;
    this._length = 0;
    this.pushMany(elements);
  }
  push(value) {
    const n = new MinNode(value);
    if (!this._head) { this._head = n; this._tail = n; }
    else { n.prev = this._tail; this._tail.next = n; this._tail = n; }
    this._length++;
  }
  pushMany(elements) {
    for (const e of elements) this.push(e);
  }
}

// With inheritance chain
class Base1 { constructor() { this._maxLen = -1; } }
class Base2 extends Base1 { constructor(opts) { super(); } }

class WithInheritDLL extends Base2 {
  constructor(elements = []) {
    super();
    this._head = undefined;
    this._tail = undefined;
    this._length = 0;
    this.pushMany(elements);
  }
  push(value) {
    const n = new MinNode(value);
    if (!this._head) { this._head = n; this._tail = n; }
    else { n.prev = this._tail; this._tail.next = n; this._tail = n; }
    this._length++;
  }
  pushMany(elements) {
    for (const e of elements) this.push(e);
  }
}

console.log(`\n=== Constructor pushMany Impact ===`);
console.log(`Creating lists then ${N.toLocaleString()} pushes, ITERATIONS = ${ITERATIONS}\n`);

const results = [];

results.push(benchmark('MinDLL (no pushMany)', () => {
  const list = new MinDLL();
  for (let i = 0; i < N; i++) list.push(i);
}));

results.push(benchmark('WithPushManyDLL', () => {
  const list = new WithPushManyDLL();
  for (let i = 0; i < N; i++) list.push(i);
}));

results.push(benchmark('WithInheritDLL', () => {
  const list = new WithInheritDLL();
  for (let i = 0; i < N; i++) list.push(i);
}));

results.push(benchmark('Real DST DoublyLinkedList', () => {
  const list = new DoublyLinkedList();
  for (let i = 0; i < N; i++) list.push(i);
}));

console.log('| Implementation | Avg (ms) | vs MinDLL |');
console.log('|----------------|----------|-----------|');
const baseTime = results[0].avg;
for (const r of results) {
  const ratio = (r.avg / baseTime).toFixed(2);
  console.log(`| ${r.name.padEnd(25)} | ${r.avg.toFixed(2).padStart(8)} | ${ratio.padStart(9)}x |`);
}
