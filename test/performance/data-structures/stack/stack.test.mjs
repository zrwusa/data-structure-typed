import { Stack } from '../../../../dist/esm/index.mjs';
import { Stack as SdslStack } from 'js-sdsl';
import Benchmark from 'benchmark';
import { magnitude } from '../../../utils/index.mjs';

const suite = new Benchmark.Suite();

const { MILLION } = magnitude;

// Test 1: 1M push
suite.add('1M push', function() {
  const stack = new Stack();
  for (let i = 0; i < MILLION; i++) {
    stack.push(i);
  }
  this.val = stack;
});

suite.add('1M push (js-sdsl)', function() {
  const stack = new SdslStack();
  for (let i = 0; i < MILLION; i++) {
    stack.push(i);
  }
  this.val = stack;
});

suite.add('Native JS Array 1M push', function() {
  const arr = [];
  for (let i = 0; i < MILLION; i++) {
    arr.push(i);
  }
  this.val = arr;
});

// Test 2: 1M push & pop
suite.add('1M push & pop', function() {
  const stack = new Stack();
  for (let i = 0; i < MILLION; i++) {
    stack.push(i);
  }
  for (let i = 0; i < MILLION; i++) {
    stack.pop();
  }
  this.val = stack;
});

suite.add('1M push & pop (js-sdsl)', function() {
  const stack = new SdslStack();
  for (let i = 0; i < MILLION; i++) {
    stack.push(i);
  }
  for (let i = 0; i < MILLION; i++) {
    stack.pop();
  }
  this.val = stack;
});

suite.add('Native JS Array 1M push & pop', function() {
  const arr = [];
  for (let i = 0; i < MILLION; i++) {
    arr.push(i);
  }
  for (let i = 0; i < MILLION; i++) {
    arr.pop();
  }
  this.val = arr;
});

export { suite };