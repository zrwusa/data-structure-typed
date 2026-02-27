import { DoublyLinkedListNode } from '../../dist/esm/index.mjs';

const N = 1_000_000;
const ITERATIONS = 10;

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

class MinNode {
  constructor(v) { 
    this.value = v; 
    this.next = undefined; 
    this.prev = undefined; 
  }
}

class SingleInheritBase {
  constructor(v) {
    this.value = v;
    this.next = undefined;
  }
}

class SingleInheritNode extends SingleInheritBase {
  constructor(v) {
    super(v);
    this.prev = undefined;
  }
}

console.log(`\n=== Node Creation Only (${N.toLocaleString()} nodes) ===\n`);

const results = [];

results.push(benchmark('Plain object literal', () => {
  const arr = [];
  for (let i = 0; i < N; i++) {
    arr.push({ value: i, next: undefined, prev: undefined });
  }
}));

results.push(benchmark('MinNode (no inherit)', () => {
  const arr = [];
  for (let i = 0; i < N; i++) arr.push(new MinNode(i));
}));

results.push(benchmark('SingleInheritNode', () => {
  const arr = [];
  for (let i = 0; i < N; i++) arr.push(new SingleInheritNode(i));
}));

results.push(benchmark('DST DoublyLinkedListNode', () => {
  const arr = [];
  for (let i = 0; i < N; i++) arr.push(new DoublyLinkedListNode(i));
}));

console.log('| Node Type | Avg (ms) | vs Plain |');
console.log('|-----------|----------|----------|');
const baseTime = results[0].avg;
for (const r of results) {
  const ratio = (r.avg / baseTime).toFixed(2);
  console.log(`| ${r.name.padEnd(25)} | ${r.avg.toFixed(2).padStart(8)} | ${ratio.padStart(8)}x |`);
}
