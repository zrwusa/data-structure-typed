import { MaxPriorityQueue } from '../../../../dist/esm/index.mjs';
import Benchmark from 'benchmark';
import { magnitude } from '../../../utils/perf.mjs';

/**
 * Max Priority Queue Benchmark Suite
 * Tests heap-based max priority queue operations
 *
 * Fixes applied:
 * ✅ Added this.val for optimization prevention
 * ✅ Uncommented export statement
 * ✅ Proper refill & poll pattern
 */

const suite = new Benchmark.Suite();
const { TEN_THOUSAND } = magnitude;

// Test: 10K refill & poll
suite.add(`${TEN_THOUSAND.toLocaleString()} refill & poll`, function() {
  // Generate unique random nodes
  const nodes = Array.from(
      new Set(
          Array.from(
              new Array(TEN_THOUSAND),
              () => Math.floor(Math.random() * TEN_THOUSAND * 100)
          )
      )
  );

  const maxPQ = new MaxPriorityQueue();
  maxPQ.refill(nodes);

  while (maxPQ.size > 0) {
    maxPQ.poll();
  }

  this.val = maxPQ;  // Prevent JIT optimization
});

export { suite };