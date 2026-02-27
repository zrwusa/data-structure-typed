// Test using plain objects vs class nodes

const N = 100_000;
const ITERATIONS = 20;

function benchmark(name, fn) {
  // Warmup
  for (let w = 0; w < 3; w++) fn();
  
  // Measure
  const times = [];
  for (let i = 0; i < ITERATIONS; i++) {
    const start = performance.now();
    fn();
    times.push(performance.now() - start);
  }
  
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  return { name, avg };
}

// Plain object approach (like js-sdsl)
class PlainDLL {
  constructor() {
    this._sentinel = {};
    this._sentinel.next = this._sentinel;
    this._sentinel.prev = this._sentinel;
    this._length = 0;
  }
  
  push(value) {
    const tail = this._sentinel.prev;
    const node = { value, prev: tail, next: this._sentinel };
    tail.next = node;
    this._sentinel.prev = node;
    this._length++;
  }
  
  get length() { return this._length; }
}

// Class-based approach (current DST)
class NodeDLL {
  constructor() {
    this._head = undefined;
    this._tail = undefined;
    this._length = 0;
  }
  
  push(value) {
    const newNode = new DLLNode(value);
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

class DLLNode {
  constructor(value) {
    this.value = value;
    this.next = undefined;
    this.prev = undefined;
  }
}

// Class node with inheritance (like DST with LinkedListNode base)
class BaseDLLNode {
  constructor(value) {
    this.value = value;
    this.next = undefined;
  }
}

class InheritedDLLNode extends BaseDLLNode {
  constructor(value) {
    super(value);
    this.prev = undefined;
  }
}

class InheritedNodeDLL {
  constructor() {
    this._head = undefined;
    this._tail = undefined;
    this._length = 0;
  }
  
  push(value) {
    const newNode = new InheritedDLLNode(value);
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

console.log(`\n=== Plain Object vs Class Node Comparison ===`);
console.log(`N = ${N.toLocaleString()}, ITERATIONS = ${ITERATIONS}\n`);

const results = [];

results.push(benchmark('Plain object (sentinel)', () => {
  const list = new PlainDLL();
  for (let i = 0; i < N; i++) list.push(i);
}));

results.push(benchmark('Class node (no inheritance)', () => {
  const list = new NodeDLL();
  for (let i = 0; i < N; i++) list.push(i);
}));

results.push(benchmark('Class node (with inheritance)', () => {
  const list = new InheritedNodeDLL();
  for (let i = 0; i < N; i++) list.push(i);
}));

console.log('| Approach | Avg (ms) |');
console.log('|----------|----------|');
for (const r of results) {
  console.log(`| ${r.name.padEnd(30)} | ${r.avg.toFixed(2).padStart(8)} |`);
}

const plainTime = results[0].avg;
console.log(`\nClass node (no inherit) vs Plain: ${(results[1].avg / plainTime).toFixed(2)}x`);
console.log(`Class node (inherited) vs Plain: ${(results[2].avg / plainTime).toFixed(2)}x`);
