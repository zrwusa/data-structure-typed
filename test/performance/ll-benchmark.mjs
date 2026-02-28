import { DoublyLinkedList, SinglyLinkedList } from '../../dist/esm/index.mjs';
import { LinkList } from 'js-sdsl';

const N = 100_000;
const ITERATIONS = 20;

function bench(fn) {
  for (let w = 0; w < 3; w++) fn();
  const times = [];
  for (let i = 0; i < ITERATIONS; i++) {
    const start = performance.now();
    fn();
    times.push(performance.now() - start);
  }
  return (times.reduce((a, b) => a + b, 0) / times.length).toFixed(2);
}

console.log(`\n=== DLL Benchmark (${N.toLocaleString()} ops) ===\n`);

console.log('push:');
console.log(`  DST:     ${bench(() => { const l = new DoublyLinkedList(); for (let i = 0; i < N; i++) l.push(i); })} ms`);
console.log(`  js-sdsl: ${bench(() => { const l = new LinkList(); for (let i = 0; i < N; i++) l.pushBack(i); })} ms`);

console.log('unshift:');
console.log(`  DST:     ${bench(() => { const l = new DoublyLinkedList(); for (let i = 0; i < N; i++) l.unshift(i); })} ms`);
console.log(`  js-sdsl: ${bench(() => { const l = new LinkList(); for (let i = 0; i < N; i++) l.pushFront(i); })} ms`);

console.log('pop:');
console.log(`  DST:     ${bench(() => { const l = new DoublyLinkedList(); for (let i = 0; i < N; i++) l.push(i); for (let i = 0; i < N; i++) l.pop(); })} ms`);
console.log(`  js-sdsl: ${bench(() => { const l = new LinkList(); for (let i = 0; i < N; i++) l.pushBack(i); for (let i = 0; i < N; i++) l.popBack(); })} ms`);

console.log('shift:');
console.log(`  DST:     ${bench(() => { const l = new DoublyLinkedList(); for (let i = 0; i < N; i++) l.push(i); for (let i = 0; i < N; i++) l.shift(); })} ms`);
console.log(`  js-sdsl: ${bench(() => { const l = new LinkList(); for (let i = 0; i < N; i++) l.pushBack(i); for (let i = 0; i < N; i++) l.popFront(); })} ms`);
