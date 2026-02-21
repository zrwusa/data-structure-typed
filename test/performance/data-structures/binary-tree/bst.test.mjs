import { BST } from '../../../../dist/esm/index.mjs';
import Benchmark from 'benchmark';
import { getRandomIntArray, magnitude } from '../../../utils/index.mjs';

/**
 * BST (Binary Search Tree) Benchmark Suite
 * Tests BST-specific operations
 *
 * Fixes applied:
 * ✅ Removed setup object syntax - use standard function form
 * ✅ Removed 0ms bug source
 * ✅ Added this.val for optimization prevention
 * ✅ Single suite export
 * ✅ Pre-built array for efficiency
 */

const suite = new Benchmark.Suite();
const { TEN_THOUSAND } = magnitude;

// Pre-build array once
const arr = getRandomIntArray(TEN_THOUSAND, 0, TEN_THOUSAND, true);

// Test 1: 10K add randomly
suite.add(`${TEN_THOUSAND.toLocaleString()} add randomly`, function() {
    const bst = new BST();
    for (let i = 0; i < arr.length; i++) {
        bst.add(arr[i]);
    }
    this.val = bst; // Prevent JIT optimization
});

// Test 2: 10K add & delete randomly
suite.add(`${TEN_THOUSAND.toLocaleString()} add & delete randomly`, function() {
    const bst = new BST();
    for (let i = 0; i < arr.length; i++) {
        bst.add(arr[i]);
    }
    for (let i = 0; i < arr.length; i++) {
        bst.delete(arr[i]);
    }
    this.val = bst; // Prevent JIT optimization
});

// Test 3: 10K addMany
suite.add(`${TEN_THOUSAND.toLocaleString()} addMany`, function() {
    const bst = new BST();
    bst.addMany(arr);
    this.val = bst; // Prevent JIT optimization
});

// Test 4: 10K get (with pre-populated tree)
suite.add(`${TEN_THOUSAND.toLocaleString()} get`, function() {
    const bst = new BST();
    bst.addMany(arr);
    for (let i = 0; i < arr.length; i++) {
        bst.get(arr[i]);
    }
    this.val = bst; // Prevent JIT optimization
});

export { suite };
