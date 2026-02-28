/**
 * Micro-benchmark: Node creation overhead
 */

import { DoublyLinkedListNode } from '../../dist/esm/index.mjs';

const N = 100_000;
const ITERATIONS = 50;

// Warm up
for (let i = 0; i < 1000; i++) {
  new DoublyLinkedListNode(i);
  ({ value: i, next: undefined, prev: undefined });
}

// Test DST class node creation
const dstTimes = [];
for (let iter = 0; iter < ITERATIONS; iter++) {
  const start = performance.now();
  for (let i = 0; i < N; i++) {
    new DoublyLinkedListNode(i);
  }
  dstTimes.push(performance.now() - start);
}

// Test plain object creation
const plainTimes = [];
for (let iter = 0; iter < ITERATIONS; iter++) {
  const start = performance.now();
  for (let i = 0; i < N; i++) {
    ({ value: i, next: undefined, prev: undefined });
  }
  plainTimes.push(performance.now() - start);
}

// Test js-sdsl style (minified property names)
const sdslTimes = [];
for (let iter = 0; iter < ITERATIONS; iter++) {
  const start = performance.now();
  for (let i = 0; i < N; i++) {
    ({ H: i, L: undefined, m: undefined });
  }
  sdslTimes.push(performance.now() - start);
}

const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
const min = arr => Math.min(...arr);

console.log('=== Node Creation Micro-benchmark ===');
console.log(`N = ${N.toLocaleString()}, ITERATIONS = ${ITERATIONS}\n`);
console.log('| Method | Avg (ms) | Min (ms) |');
console.log('|--------|----------|----------|');
console.log(`| DST class node  | ${avg(dstTimes).toFixed(2).padStart(8)} | ${min(dstTimes).toFixed(2).padStart(8)} |`);
console.log(`| Plain object    | ${avg(plainTimes).toFixed(2).padStart(8)} | ${min(plainTimes).toFixed(2).padStart(8)} |`);
console.log(`| js-sdsl style   | ${avg(sdslTimes).toFixed(2).padStart(8)} | ${min(sdslTimes).toFixed(2).padStart(8)} |`);
console.log(`\nClass vs Plain ratio: ${(avg(dstTimes) / avg(plainTimes)).toFixed(2)}x`);
console.log(`Class vs js-sdsl ratio: ${(avg(dstTimes) / avg(sdslTimes)).toFixed(2)}x`);
