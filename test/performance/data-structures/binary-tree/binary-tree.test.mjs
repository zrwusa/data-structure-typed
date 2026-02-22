import { BinaryTree } from '../../../../dist/esm/index.mjs';
import Benchmark from 'benchmark';
import { getRandomIntArray, magnitude } from '../../../utils/perf.mjs';

/**
 * Binary Tree Benchmark Suite
 * Tests general binary tree operations
 *
 * Fixes applied:
 * ✅ Removed chain calls - standard function form
 * ✅ Added this.val for optimization prevention
 * ✅ Added export statement
 * ✅ Fixed setup/teardown logic
 */

const suite = new Benchmark.Suite();
const { THOUSAND } = magnitude;

// Pre-build array once
const arr = getRandomIntArray(THOUSAND, 0, THOUSAND, true);

// Test 1: 1K add randomly
suite.add(`${THOUSAND.toLocaleString()} add randomly`, function() {
  const tree = new BinaryTree();
  for (let i = 0; i < arr.length; i++) {
    tree.add(arr[i]);
  }
  this.val = tree;  // Prevent JIT optimization
});

// Test 2: 1K add & delete randomly
suite.add(`${THOUSAND.toLocaleString()} add & delete randomly`, function() {
  const tree = new BinaryTree();
  for (let i = 0; i < arr.length; i++) {
    tree.add(arr[i]);
  }
  for (let i = 0; i < arr.length; i++) {
    tree.delete(arr[i]);
  }
  this.val = tree;  // Prevent JIT optimization
});

// Test 3: 1K addMany
suite.add(`${THOUSAND.toLocaleString()} addMany`, function() {
  const tree = new BinaryTree();
  tree.addMany(arr);
  this.val = tree;  // Prevent JIT optimization
});

// Test 4: 1K get
suite.add(`${THOUSAND.toLocaleString()} get`, function() {
  const tree = new BinaryTree();
  tree.addMany(arr);
  for (let i = 0; i < arr.length; i++) {
    tree.get(arr[i]);
  }
  this.val = tree;  // Prevent JIT optimization
});

// Test 5: 1K has
suite.add(`${THOUSAND.toLocaleString()} has`, function() {
  const tree = new BinaryTree();
  tree.addMany(arr);
  for (let i = 0; i < arr.length; i++) {
    tree.has(arr[i]);
  }
  this.val = tree;  // Prevent JIT optimization
});

// Test 6: 1K dfs
suite.add(`${THOUSAND.toLocaleString()} dfs`, function() {
  const tree = new BinaryTree();
  tree.addMany(arr);
  for (let i = 0; i < THOUSAND; i++) {
    tree.dfs();
  }
  this.val = tree;  // Prevent JIT optimization
});

// Test 7: 1K bfs
suite.add(`${THOUSAND.toLocaleString()} bfs`, function() {
  const tree = new BinaryTree();
  tree.addMany(arr);
  for (let i = 0; i < THOUSAND; i++) {
    tree.bfs();
  }
  this.val = tree;  // Prevent JIT optimization
});

// Test 8: 1K morris
suite.add(`${THOUSAND.toLocaleString()} morris`, function() {
  const tree = new BinaryTree();
  tree.addMany(arr);
  for (let i = 0; i < THOUSAND; i++) {
    tree.morris(n => n, 'PRE');
  }
  this.val = tree;  // Prevent JIT optimization
});

export { suite };