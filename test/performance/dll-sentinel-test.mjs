/**
 * Test: DLL with Sentinel pattern
 */

import { LinkList } from 'js-sdsl';

// Simple sentinel-based DLL implementation for testing
class SentinelNode {
  constructor(value) {
    this.value = value;
    this.next = undefined;
    this.prev = undefined;
  }
}

class SentinelDLL {
  constructor() {
    this._sentinel = new SentinelNode(undefined);
    this._sentinel.next = this._sentinel;
    this._sentinel.prev = this._sentinel;
    this._length = 0;
  }

  get length() {
    return this._length;
  }

  push(value) {
    const node = new SentinelNode(value);
    // No null check needed
    node.prev = this._sentinel.prev;
    node.next = this._sentinel;
    this._sentinel.prev.next = node;
    this._sentinel.prev = node;
    this._length++;
    return true;
  }

  unshift(value) {
    const node = new SentinelNode(value);
    node.next = this._sentinel.next;
    node.prev = this._sentinel;
    this._sentinel.next.prev = node;
    this._sentinel.next = node;
    this._length++;
    return true;
  }

  pop() {
    if (this._length === 0) return undefined;
    const node = this._sentinel.prev;
    node.prev.next = this._sentinel;
    this._sentinel.prev = node.prev;
    this._length--;
    return node.value;
  }

  shift() {
    if (this._length === 0) return undefined;
    const node = this._sentinel.next;
    node.next.prev = this._sentinel;
    this._sentinel.next = node.next;
    this._length--;
    return node.value;
  }
}

const N = 100_000;
const ITERATIONS = 20;

// Warm up
for (let i = 0; i < 1000; i++) {
  const list = new SentinelDLL();
  list.push(i);
}

// Test Sentinel DLL push
const sentinelPushTimes = [];
for (let iter = 0; iter < ITERATIONS; iter++) {
  const list = new SentinelDLL();
  const start = performance.now();
  for (let i = 0; i < N; i++) {
    list.push(i);
  }
  sentinelPushTimes.push(performance.now() - start);
}

// Test Sentinel DLL unshift
const sentinelUnshiftTimes = [];
for (let iter = 0; iter < ITERATIONS; iter++) {
  const list = new SentinelDLL();
  const start = performance.now();
  for (let i = 0; i < N; i++) {
    list.unshift(i);
  }
  sentinelUnshiftTimes.push(performance.now() - start);
}

// Test js-sdsl push
const sdslPushTimes = [];
for (let iter = 0; iter < ITERATIONS; iter++) {
  const list = new LinkList();
  const start = performance.now();
  for (let i = 0; i < N; i++) {
    list.pushBack(i);
  }
  sdslPushTimes.push(performance.now() - start);
}

// Test js-sdsl unshift
const sdslUnshiftTimes = [];
for (let iter = 0; iter < ITERATIONS; iter++) {
  const list = new LinkList();
  const start = performance.now();
  for (let i = 0; i < N; i++) {
    list.pushFront(i);
  }
  sdslUnshiftTimes.push(performance.now() - start);
}

const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
const min = arr => Math.min(...arr);

console.log('=== Sentinel DLL Benchmark ===');
console.log(`N = ${N.toLocaleString()}, ITERATIONS = ${ITERATIONS}\n`);
console.log('| Operation | Avg (ms) | Min (ms) |');
console.log('|-----------|----------|----------|');
console.log(`| Sentinel push     | ${avg(sentinelPushTimes).toFixed(2).padStart(8)} | ${min(sentinelPushTimes).toFixed(2).padStart(8)} |`);
console.log(`| js-sdsl pushBack  | ${avg(sdslPushTimes).toFixed(2).padStart(8)} | ${min(sdslPushTimes).toFixed(2).padStart(8)} |`);
console.log(`| Sentinel unshift  | ${avg(sentinelUnshiftTimes).toFixed(2).padStart(8)} | ${min(sentinelUnshiftTimes).toFixed(2).padStart(8)} |`);
console.log(`| js-sdsl pushFront | ${avg(sdslUnshiftTimes).toFixed(2).padStart(8)} | ${min(sdslUnshiftTimes).toFixed(2).padStart(8)} |`);
console.log(`\nPush ratio: ${(avg(sentinelPushTimes) / avg(sdslPushTimes)).toFixed(2)}x`);
console.log(`Unshift ratio: ${(avg(sentinelUnshiftTimes) / avg(sdslUnshiftTimes)).toFixed(2)}x`);
