import { Queue } from '../../../../dist/esm/index.mjs';
import { Queue as SdslQueue } from 'js-sdsl';
import Benchmark from 'benchmark';
import { magnitude } from '../../../utils/perf.mjs';

/**
 * Queue Benchmark Suite
 * Measures performance of FIFO queue operations
 */

const suite = new Benchmark.Suite();

const { MILLION, HUNDRED_THOUSAND } = magnitude;

// Test 1: 1M push
suite.add(`${MILLION.toLocaleString()} push`, function() {
  const queue = new Queue();
  for (let i = 0; i < MILLION; i++) {
    queue.push(i);
  }
  this.val = queue;  // Prevent JIT optimization
});

// Test 2: 100K push & shift (FIFO - Queue behavior)
suite.add(`${HUNDRED_THOUSAND.toLocaleString()} push & shift`, function() {
  const queue = new Queue();
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    queue.push(i);
  }
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    queue.shift();
  }
  this.val = queue;  // Prevent JIT optimization
});

// Native baseline: push-only (apples-to-apples for the push-only case)
suite.add(`Native JS Array ${MILLION.toLocaleString()} push`, function() {
  const arr = [];
  for (let i = 0; i < MILLION; i++) {
    arr.push(i);
  }
  this.val = arr;
});

// Test 3: Native JS Array 100K push & shift (for comparison)
suite.add(`Native JS Array ${HUNDRED_THOUSAND.toLocaleString()} push & shift`, function() {
  const arr = [];
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    arr.push(i);
  }
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    arr.shift();
  }
  this.val = arr;
});

// js-sdsl Queue comparison
suite.add(`${MILLION.toLocaleString()} push (js-sdsl)`, function() {
  const queue = new SdslQueue();
  for (let i = 0; i < MILLION; i++) {
    queue.push(i);
  }
  this.val = queue;
});

suite.add(`${HUNDRED_THOUSAND.toLocaleString()} push & shift (js-sdsl)`, function() {
  const queue = new SdslQueue();
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    queue.push(i);
  }
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    queue.pop();  // js-sdsl Queue uses pop() for dequeue
  }
  this.val = queue;
});

export { suite };
