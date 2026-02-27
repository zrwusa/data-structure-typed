import { DoublyLinkedList } from '../../dist/esm/index.mjs';

const N = 100_000;
const ITERATIONS = 100;

// Warm up
for (let w = 0; w < 10; w++) {
  const warmup = new DoublyLinkedList();
  for (let i = 0; i < 10000; i++) warmup.push(i);
}

// Profile
for (let iter = 0; iter < ITERATIONS; iter++) {
  const dst = new DoublyLinkedList();
  for (let i = 0; i < N; i++) {
    dst.push(i);
  }
}

console.log('Done');
