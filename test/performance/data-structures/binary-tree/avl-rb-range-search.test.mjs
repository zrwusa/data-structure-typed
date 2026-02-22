import { AVLTree, RedBlackTree } from '../../../../dist/esm/index.mjs';
import Benchmark from 'benchmark';
import { getRandomIntArray, magnitude } from '../../../utils/perf.mjs';

/**
 * AVL Tree vs Red-Black Tree Range Search Benchmark
 * Compares performance of range search operations on balanced BSTs
 *
 * Fixes applied:
 * ✅ Separated tree initialization (setup phase)
 * ✅ Fixed benchmark size inconsistency (100K vs 1M)
 * ✅ Removed .on() event handlers
 * ✅ Removed .run() call
 * ✅ Added this.val for optimization prevention
 * ✅ Changed to standard function form (not chained)
 * ✅ Pre-built trees (critical for fair comparison)
 * ✅ Test names aligned with best practices
 */

const suite = new Benchmark.Suite();

const { MILLION, HUNDRED_THOUSAND } = magnitude;

// Pre-build random array once
const randomArray = getRandomIntArray(MILLION, 0, MILLION - 1, false);

// Pre-build AVL tree
const avlTree = new AVLTree();
for (let i = 0; i < HUNDRED_THOUSAND; i++) {
  avlTree.add(randomArray[i]);
}

// Pre-build Red-Black tree
const rbTree = new RedBlackTree();
for (let i = 0; i < MILLION; i++) {
  rbTree.add(randomArray[i]);
}

// Test 1: AVL Tree 100K rangeSearch [69900, 70000]
suite.add(`AVL Tree ${HUNDRED_THOUSAND.toLocaleString()} rangeSearch`, function() {
  const result = avlTree.rangeSearch([69900, 70000]);
  this.val = result;  // Prevent JIT optimization
});

// Test 2: Red-Black Tree 1M rangeSearch [69900, 70000]
suite.add(`Red-Black Tree ${MILLION.toLocaleString()} rangeSearch`, function() {
  const result = rbTree.rangeSearch([69900, 70000]);
  this.val = result;  // Prevent JIT optimization
});

export { suite };
