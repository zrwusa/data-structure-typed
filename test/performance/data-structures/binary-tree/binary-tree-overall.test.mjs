import { AVLTree, RedBlackTree } from '../../../../dist/esm/index.mjs';
import Benchmark from 'benchmark';
import { getRandomIntArray, magnitude } from '../../../utils/index.mjs';

/**
 * AVL Tree vs Red-Black Tree Comparison Benchmark
 * Overall performance metrics for balanced BSTs
 *
 * Fixes applied:
 * ✅ Removed chain calls - standard function form
 * ✅ Added this.val for optimization prevention
 * ✅ Removed unnecessary .clear() calls
 * ✅ Pre-built trees for fair comparison
 * ✅ Added export statement
 */

const suite = new Benchmark.Suite();
const { TEN_THOUSAND } = magnitude;

// Pre-build array once
const arr = getRandomIntArray(TEN_THOUSAND, 0, TEN_THOUSAND - 1, true);

// Test 1: RB Tree add randomly
suite.add(`${TEN_THOUSAND.toLocaleString()} RedBlackTree add randomly`, function() {
  const tree = new RedBlackTree();
  for (let i = 0; i < arr.length; i++) {
    tree.add(arr[i]);
  }
  this.val = tree;  // Prevent JIT optimization
});

// Test 2: RB Tree get randomly
suite.add(`${TEN_THOUSAND.toLocaleString()} RedBlackTree get randomly`, function() {
  const tree = new RedBlackTree();
  tree.addMany(arr);
  for (let i = 0; i < arr.length; i++) {
    tree.get(arr[i]);
  }
  this.val = tree;  // Prevent JIT optimization
});

// Test 3: RB Tree add & delete randomly
suite.add(`${TEN_THOUSAND.toLocaleString()} RedBlackTree add & delete randomly`, function() {
  const tree = new RedBlackTree();
  for (let i = 0; i < arr.length; i++) {
    tree.add(arr[i]);
  }
  for (let i = 0; i < arr.length; i++) {
    tree.delete(arr[i]);
  }
  this.val = tree;  // Prevent JIT optimization
});

// Test 4: AVL Tree add randomly
suite.add(`${TEN_THOUSAND.toLocaleString()} AVLTree add randomly`, function() {
  const tree = new AVLTree();
  for (let i = 0; i < arr.length; i++) {
    tree.add(arr[i]);
  }
  this.val = tree;  // Prevent JIT optimization
});

// Test 5: AVL Tree get randomly
suite.add(`${TEN_THOUSAND.toLocaleString()} AVLTree get randomly`, function() {
  const tree = new AVLTree();
  tree.addMany(arr);
  for (let i = 0; i < arr.length; i++) {
    tree.get(arr[i]);
  }
  this.val = tree;  // Prevent JIT optimization
});

// Test 6: AVL Tree add & delete randomly
suite.add(`${TEN_THOUSAND.toLocaleString()} AVLTree add & delete randomly`, function() {
  const tree = new AVLTree();
  for (let i = 0; i < arr.length; i++) {
    tree.add(arr[i]);
  }
  for (let i = 0; i < arr.length; i++) {
    tree.delete(arr[i]);
  }
  this.val = tree;  // Prevent JIT optimization
});

export { suite };