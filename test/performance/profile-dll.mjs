import { DoublyLinkedList } from '../../dist/esm/index.mjs';
import { LinkList } from 'js-sdsl';

const N = 100_000;

console.log('=== Profiling DoublyLinkedList push ===');
console.log(`N = ${N.toLocaleString()}`);

// Warm up
for (let w = 0; w < 3; w++) {
  const warmup = new DoublyLinkedList();
  for (let i = 0; i < 1000; i++) warmup.push(i);
}

console.log('\n--- DST DoublyLinkedList ---');
const dstStart = performance.now();
const dst = new DoublyLinkedList();
for (let i = 0; i < N; i++) {
  dst.push(i);
}
const dstEnd = performance.now();
console.log(`DST: ${(dstEnd - dstStart).toFixed(2)}ms`);

// Warm up js-sdsl
for (let w = 0; w < 3; w++) {
  const warmup = new LinkList();
  for (let i = 0; i < 1000; i++) warmup.pushBack(i);
}

console.log('\n--- js-sdsl LinkList ---');
const sdslStart = performance.now();
const sdsl = new LinkList();
for (let i = 0; i < N; i++) {
  sdsl.pushBack(i);
}
const sdslEnd = performance.now();
console.log(`js-sdsl: ${(sdslEnd - sdslStart).toFixed(2)}ms`);

console.log(`\nRatio: ${((dstEnd - dstStart) / (sdslEnd - sdslStart)).toFixed(2)}x slower`);
