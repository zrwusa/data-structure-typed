import { DoublyLinkedList } from '../../dist/esm/index.mjs';
import { LinkList } from 'js-sdsl';

const N = 100_000;
const ITERATIONS = 50;

console.log('=== Intensive Profiling DoublyLinkedList push ===');
console.log(`N = ${N.toLocaleString()}, ITERATIONS = ${ITERATIONS}`);

// Warm up
for (let w = 0; w < 5; w++) {
  const warmup = new DoublyLinkedList();
  for (let i = 0; i < 10000; i++) warmup.push(i);
}

console.log('\n--- DST DoublyLinkedList ---');
const dstStart = performance.now();
for (let iter = 0; iter < ITERATIONS; iter++) {
  const dst = new DoublyLinkedList();
  for (let i = 0; i < N; i++) {
    dst.push(i);
  }
}
const dstEnd = performance.now();
console.log(`DST total: ${(dstEnd - dstStart).toFixed(2)}ms`);
console.log(`DST avg per iteration: ${((dstEnd - dstStart) / ITERATIONS).toFixed(2)}ms`);

// Warm up js-sdsl
for (let w = 0; w < 5; w++) {
  const warmup = new LinkList();
  for (let i = 0; i < 10000; i++) warmup.pushBack(i);
}

console.log('\n--- js-sdsl LinkList ---');
const sdslStart = performance.now();
for (let iter = 0; iter < ITERATIONS; iter++) {
  const sdsl = new LinkList();
  for (let i = 0; i < N; i++) {
    sdsl.pushBack(i);
  }
}
const sdslEnd = performance.now();
console.log(`js-sdsl total: ${(sdslEnd - sdslStart).toFixed(2)}ms`);
console.log(`js-sdsl avg per iteration: ${((sdslEnd - sdslStart) / ITERATIONS).toFixed(2)}ms`);

console.log(`\nRatio: ${((dstEnd - dstStart) / (sdslEnd - sdslStart)).toFixed(2)}x slower`);
