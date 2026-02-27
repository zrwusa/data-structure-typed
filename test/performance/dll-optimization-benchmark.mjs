import { DoublyLinkedList } from '../../dist/esm/index.mjs';
import { LinkList } from 'js-sdsl';

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
  const min = Math.min(...times);
  const max = Math.max(...times);
  
  return { name, avg, min, max };
}

console.log(`\n=== DLL Optimization Benchmark ===`);
console.log(`N = ${N.toLocaleString()}, ITERATIONS = ${ITERATIONS}\n`);

const results = [];

// DST DoublyLinkedList push
results.push(benchmark('DST push', () => {
  const list = new DoublyLinkedList();
  for (let i = 0; i < N; i++) list.push(i);
}));

// js-sdsl LinkList pushBack
results.push(benchmark('js-sdsl pushBack', () => {
  const list = new LinkList();
  for (let i = 0; i < N; i++) list.pushBack(i);
}));

// DST DoublyLinkedList unshift
results.push(benchmark('DST unshift', () => {
  const list = new DoublyLinkedList();
  for (let i = 0; i < N; i++) list.unshift(i);
}));

// js-sdsl LinkList pushFront
results.push(benchmark('js-sdsl pushFront', () => {
  const list = new LinkList();
  for (let i = 0; i < N; i++) list.pushFront(i);
}));

// Print results
console.log('| Operation | Avg (ms) | Min (ms) | Max (ms) |');
console.log('|-----------|----------|----------|----------|');
for (const r of results) {
  console.log(`| ${r.name.padEnd(17)} | ${r.avg.toFixed(2).padStart(8)} | ${r.min.toFixed(2).padStart(8)} | ${r.max.toFixed(2).padStart(8)} |`);
}

// Ratios
const pushRatio = results[0].avg / results[1].avg;
const unshiftRatio = results[2].avg / results[3].avg;
console.log(`\nPush ratio: ${pushRatio.toFixed(2)}x slower`);
console.log(`Unshift ratio: ${unshiftRatio.toFixed(2)}x slower`);
