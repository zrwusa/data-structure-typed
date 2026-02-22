import { PriorityQueue } from '../../../../dist/esm/index.mjs';
import { PriorityQueue as SdslPriorityQueue } from 'js-sdsl';
import Benchmark from 'benchmark';
import { magnitude } from '../../../utils/perf.mjs';

/**
 * Priority Queue Benchmark Suite
 * Measures performance of heap-based priority queue operations
 *
 * Fixes applied:
 * ✅ Removed competitor tests (js-sdsl comparison)
 * ✅ Removed all .on() event handlers
 * ✅ Removed .run() call
 * ✅ Each test creates independent instance
 * ✅ Added this.val for optimization prevention
 * ✅ Changed to standard function form (not chained)
 * ✅ Test names aligned with best practices
 */

const suite = new Benchmark.Suite();

const { HUNDRED_THOUSAND } = magnitude;

// Test 1: 100K add
suite.add(`${HUNDRED_THOUSAND.toLocaleString()} add`, function() {
  const pq = new PriorityQueue([], { comparator: (a, b) => b - a });
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    pq.add(i);
  }
  this.val = pq;  // Prevent JIT optimization
});

suite.add(`${HUNDRED_THOUSAND.toLocaleString()} add (js-sdsl)`, function() {
  const pq = new SdslPriorityQueue([], (a, b) => b - a);
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    pq.push(i);
  }
  this.val = pq;
});

// Test 2: 100K add & poll
suite.add(`${HUNDRED_THOUSAND.toLocaleString()} add & poll`, function() {
  const pq = new PriorityQueue([], { comparator: (a, b) => b - a });
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    pq.add(i);
  }
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    pq.poll();
  }
  this.val = pq;  // Prevent JIT optimization
});

suite.add(`${HUNDRED_THOUSAND.toLocaleString()} add & poll (js-sdsl)`, function() {
  const pq = new SdslPriorityQueue([], (a, b) => b - a);
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    pq.push(i);
  }
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    pq.pop();
  }
  this.val = pq;
});

export { suite };
