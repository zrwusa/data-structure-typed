// Test inheritance depth impact

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

// No inheritance
class DLLNode0 {
  constructor(value) {
    this.value = value;
    this.next = undefined;
    this.prev = undefined;
  }
}

class DLL0 {
  constructor() {
    this._head = undefined;
    this._tail = undefined;
    this._length = 0;
  }
  
  push(value) {
    const n = new DLLNode0(value);
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

// 1 level inheritance
class Base1 {
  constructor() {
    this._maxLen = -1;
  }
}

class DLL1 extends Base1 {
  constructor() {
    super();
    this._head = undefined;
    this._tail = undefined;
    this._length = 0;
  }
  
  push(value) {
    const n = new DLLNode0(value);
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

// 2 levels inheritance
class Base2a {
  constructor() {
    this._toElementFn = undefined;
  }
}

class Base2b extends Base2a {
  constructor() {
    super();
    this._maxLen = -1;
  }
}

class DLL2 extends Base2b {
  constructor() {
    super();
    this._head = undefined;
    this._tail = undefined;
    this._length = 0;
  }
  
  push(value) {
    const n = new DLLNode0(value);
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

// 3 levels (like DST: IterableElementBase -> LinearBase -> LinearLinkedBase -> DoublyLinkedList)
class Base3a {
  constructor() {
    this._toElementFn = undefined;
  }
}

class Base3b extends Base3a {
  constructor() {
    super();
    this._maxLen = -1;
  }
}

class Base3c extends Base3b {
  constructor() {
    super();
  }
}

class DLL3 extends Base3c {
  constructor() {
    super();
    this._head = undefined;
    this._tail = undefined;
    this._length = 0;
  }
  
  push(value) {
    const n = new DLLNode0(value);
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

console.log(`\n=== Inheritance Depth Impact ===`);
console.log(`N = ${N.toLocaleString()}, ITERATIONS = ${ITERATIONS}\n`);

const results = [];

results.push(benchmark('No inheritance', () => {
  const list = new DLL0();
  for (let i = 0; i < N; i++) list.push(i);
}));

results.push(benchmark('1 level inheritance', () => {
  const list = new DLL1();
  for (let i = 0; i < N; i++) list.push(i);
}));

results.push(benchmark('2 levels inheritance', () => {
  const list = new DLL2();
  for (let i = 0; i < N; i++) list.push(i);
}));

results.push(benchmark('3 levels inheritance', () => {
  const list = new DLL3();
  for (let i = 0; i < N; i++) list.push(i);
}));

console.log('| Inheritance Level | Avg (ms) | vs No inherit |');
console.log('|-------------------|----------|---------------|');
const baseTime = results[0].avg;
for (const r of results) {
  const ratio = (r.avg / baseTime).toFixed(2);
  console.log(`| ${r.name.padEnd(20)} | ${r.avg.toFixed(2).padStart(8)} | ${ratio.padStart(13)}x |`);
}
