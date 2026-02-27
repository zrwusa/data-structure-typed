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

// Sentinel 方式 - 完整实现
class SentinelDLL {
  constructor() {
    this._sentinel = { value: undefined, next: null, prev: null };
    this._sentinel.next = this._sentinel;
    this._sentinel.prev = this._sentinel;
    this._length = 0;
  }
  
  // 在 pos 后面插入
  _insertAfter(value, pos) {
    const next = pos.next;
    const node = { value, prev: pos, next };
    pos.next = node;
    next.prev = node;
    this._length++;
  }
  
  push(value) {
    this._insertAfter(value, this._sentinel.prev);
  }
  
  unshift(value) {
    this._insertAfter(value, this._sentinel);
  }
  
  get length() { return this._length; }
  get first() { return this._length > 0 ? this._sentinel.next.value : undefined; }
  get last() { return this._length > 0 ? this._sentinel.prev.value : undefined; }
}

console.log(`\n=== Sentinel v2 Test ===`);
console.log(`N = ${N.toLocaleString()}, ITERATIONS = ${ITERATIONS}\n`);

// Verify correctness
const test = new SentinelDLL();
test.push(1); test.push(2); test.push(3);
test.unshift(0);
console.log('Correctness check: first=%d, last=%d, length=%d', test.first, test.last, test.length);
console.log('Expected: first=0, last=3, length=4\n');

const results = [];

results.push(benchmark('js-sdsl push', () => {
  const list = new LinkList();
  for (let i = 0; i < N; i++) list.pushBack(i);
}));

results.push(benchmark('Sentinel push', () => {
  const list = new SentinelDLL();
  for (let i = 0; i < N; i++) list.push(i);
}));

results.push(benchmark('DST push', () => {
  const list = new DoublyLinkedList();
  for (let i = 0; i < N; i++) list.push(i);
}));

results.push(benchmark('js-sdsl unshift', () => {
  const list = new LinkList();
  for (let i = 0; i < N; i++) list.pushFront(i);
}));

results.push(benchmark('Sentinel unshift', () => {
  const list = new SentinelDLL();
  for (let i = 0; i < N; i++) list.unshift(i);
}));

results.push(benchmark('DST unshift', () => {
  const list = new DoublyLinkedList();
  for (let i = 0; i < N; i++) list.unshift(i);
}));

console.log('| Operation | Avg (ms) | vs js-sdsl |');
console.log('|-----------|----------|------------|');

// Push comparison
const jsPush = results[0].avg;
for (let i = 0; i < 3; i++) {
  const r = results[i];
  const ratio = (r.avg / jsPush).toFixed(2);
  console.log(`| ${r.name.padEnd(18)} | ${r.avg.toFixed(2).padStart(8)} | ${ratio.padStart(10)}x |`);
}

console.log('|-----------|----------|------------|');

// Unshift comparison  
const jsUnshift = results[3].avg;
for (let i = 3; i < 6; i++) {
  const r = results[i];
  const ratio = (r.avg / jsUnshift).toFixed(2);
  console.log(`| ${r.name.padEnd(18)} | ${r.avg.toFixed(2).padStart(8)} | ${ratio.padStart(10)}x |`);
}

console.log(`\n📊 Summary:`);
console.log(`Push:    Sentinel ${(results[1].avg/results[0].avg).toFixed(2)}x vs js-sdsl, DST ${(results[2].avg/results[0].avg).toFixed(2)}x`);
console.log(`Unshift: Sentinel ${(results[4].avg/results[3].avg).toFixed(2)}x vs js-sdsl, DST ${(results[5].avg/results[3].avg).toFixed(2)}x`);
