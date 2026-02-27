import { DoublyLinkedListNode } from '../../dist/esm/index.mjs';

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

// Plain object
class PlainNode {
  constructor(value) {
    this.value = value;
    this.next = undefined;
    this.prev = undefined;
  }
}

// With getter/setter for value
class GetterNode {
  constructor(value) {
    this._value = value;
    this.next = undefined;
    this.prev = undefined;
  }
  get value() { return this._value; }
  set value(v) { this._value = v; }
}

// With getter/setter for next/prev too
class FullGetterNode {
  constructor(value) {
    this._value = value;
    this._next = undefined;
    this._prev = undefined;
  }
  get value() { return this._value; }
  set value(v) { this._value = v; }
  get next() { return this._next; }
  set next(v) { this._next = v; }
  get prev() { return this._prev; }
  set prev(v) { this._prev = v; }
}

// Single inheritance
class BaseNode {
  constructor(value) {
    this.value = value;
    this.next = undefined;
  }
}

class InheritedNode extends BaseNode {
  constructor(value) {
    super(value);
    this.prev = undefined;
  }
}

// Double inheritance (like DST: LinkedListNode -> DoublyLinkedListNode)
class LinkedListNodeLike {
  constructor(value) {
    this._value = value;
    this._next = undefined;
  }
  get value() { return this._value; }
  set value(v) { this._value = v; }
  get next() { return this._next; }
  set next(v) { this._next = v; }
}

class DLLNodeLike extends LinkedListNodeLike {
  constructor(value) {
    super(value);
    this._value = value;  // DST does this redundantly!
    this._next = undefined;  // DST does this too!
    this._prev = undefined;
  }
  get prev() { return this._prev; }
  set prev(v) { this._prev = v; }
}

console.log(`\n=== Node Class Analysis ===`);
console.log(`Creating ${N.toLocaleString()} nodes, ITERATIONS = ${ITERATIONS}\n`);

const results = [];

results.push(benchmark('Plain object properties', () => {
  const arr = [];
  for (let i = 0; i < N; i++) arr.push(new PlainNode(i));
}));

results.push(benchmark('Value getter/setter', () => {
  const arr = [];
  for (let i = 0; i < N; i++) arr.push(new GetterNode(i));
}));

results.push(benchmark('Full getters/setters', () => {
  const arr = [];
  for (let i = 0; i < N; i++) arr.push(new FullGetterNode(i));
}));

results.push(benchmark('Single inheritance', () => {
  const arr = [];
  for (let i = 0; i < N; i++) arr.push(new InheritedNode(i));
}));

results.push(benchmark('DST-like double inherit', () => {
  const arr = [];
  for (let i = 0; i < N; i++) arr.push(new DLLNodeLike(i));
}));

results.push(benchmark('Real DST DoublyLinkedListNode', () => {
  const arr = [];
  for (let i = 0; i < N; i++) arr.push(new DoublyLinkedListNode(i));
}));

console.log('| Node Type | Avg (ms) | vs Plain |');
console.log('|-----------|----------|----------|');
const baseTime = results[0].avg;
for (const r of results) {
  const ratio = (r.avg / baseTime).toFixed(2);
  console.log(`| ${r.name.padEnd(30)} | ${r.avg.toFixed(2).padStart(8)} | ${ratio.padStart(8)}x |`);
}
