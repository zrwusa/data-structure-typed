import { AVLTree } from '../../../../dist/esm/index.mjs';

import Benchmark from 'benchmark';

import { getRandomInt, getRandomIntArray, magnitude } from '../../../utils/index.mjs';

const suite = new Benchmark.Suite();

const { HUNDRED_THOUSAND } = magnitude;

const randomArray = new Array(HUNDRED_THOUSAND)
    .fill(0)
    .map(() => getRandomInt(0, HUNDRED_THOUSAND - 1));

// Global trees for tests that need pre-built data
let treeForGet = null;
let treeForGetNode = null;
let treeForIterator = null;

// Global trees and query ranges for rangeSearch
let treeForRangeSearch = null;
let queryRanges = [];

// Keep rangeSearch reasonably fast by default.
// Env overrides (optional): AVL_RS_N, AVL_RS_QUERY_COUNT, AVL_RS_RANGE_SIZE
const RANGESEARCH_N = Number(process.env.AVL_RS_N ?? HUNDRED_THOUSAND);
const QUERY_COUNT = Number(process.env.AVL_RS_QUERY_COUNT ?? HUNDRED_THOUSAND);
const RANGE_SIZE = Number(process.env.AVL_RS_RANGE_SIZE ?? 100);

// Initialize all trees in suite 'start' event (NOT TIMED)
suite.on('start', function() {
  treeForGet = new AVLTree();
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    treeForGet.add(randomArray[i]);
  }

  treeForGetNode = new AVLTree();
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    treeForGetNode.add(randomArray[i]);
  }

  treeForIterator = new AVLTree();
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    treeForIterator.add(randomArray[i]);
  }

  // Initialize for rangeSearch test
  const randomArrayLarge = getRandomIntArray(RANGESEARCH_N, 0, RANGESEARCH_N - 1, false);
  treeForRangeSearch = new AVLTree();
  for (let i = 0; i < RANGESEARCH_N; i++) {
    treeForRangeSearch.add(randomArrayLarge[i]);
  }

  // Pre-generate random query ranges
  queryRanges = [];
  for (let i = 0; i < QUERY_COUNT; i++) {
    const min = Math.floor(Math.random() * (RANGESEARCH_N - RANGE_SIZE));
    queryRanges.push([min, min + RANGE_SIZE]);
  }
});

suite.add('100K add randomly', function() {
  const tree = new AVLTree();
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    tree.add(randomArray[i]);
  }
  this.val = tree;
});

suite.add('100K add', function() {
  const tree = new AVLTree();
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    tree.add(i);
  }
  this.val = tree;
});

suite.add('100K get', function() {
  let count = 0;
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    if (treeForGet.get(randomArray[i]) !== undefined) {
      count++;
    }
  }
  this.val = count;
});

suite.add('100K getNode', function() {
  let count = 0;
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    if (treeForGetNode.getNode(randomArray[i]) !== undefined) {
      count++;
    }
  }
  this.val = count;
});

suite.add('100K iterator', function() {
  let count = 0;
  for (const node of treeForIterator) {
    count++;
  }
  this.val = count;
});

suite.add('100K add & delete orderly', function() {
  const tree = new AVLTree();
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    tree.add(i);
  }
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    tree.delete(i);
  }
  this.val = tree;
});

suite.add('100K add & delete randomly', function() {
  const tree = new AVLTree();
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    tree.add(randomArray[i]);
  }
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    tree.delete(randomArray[i]);
  }
  this.val = tree;
});

// rangeSearch queries (default: 100K queries on 100K data)
suite.add('AVL Tree 100K rangeSearch queries', function() {
  let totalResults = 0;
  for (let i = 0; i < QUERY_COUNT; i++) {
    const result = treeForRangeSearch.rangeSearch(queryRanges[i]);
    totalResults += result.length;
  }
  this.val = totalResults; // Prevent JIT optimization
});

export { suite };
