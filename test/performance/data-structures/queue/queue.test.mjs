import { Queue } from '../../../../dist/esm/index.mjs';
import Benchmark from 'benchmark';
import { magnitude } from '../../../utils/index.mjs';

/**
 * Queue Benchmark Suite
 * Measures performance of FIFO queue operations
 *
 * Fixes applied:
 * ✅ Removed competitor tests (js-sdsl comparison)
 * ✅ Removed all .on() event handlers
 * ✅ Removed .run() call
 * ✅ Each test creates independent instance
 * ✅ Added this.val for optimization prevention
 * ✅ Test names aligned with best practices
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
  this.val = arr;  // Prevent JIT optimization
});

export { suite };
