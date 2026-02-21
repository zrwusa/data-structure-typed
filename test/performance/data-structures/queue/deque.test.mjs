import { Deque } from '../../../../dist/esm/index.mjs';
import Benchmark from 'benchmark';
import { magnitude } from '../../../utils/index.mjs';

const suite = new Benchmark.Suite();
const { MILLION, HUNDRED_THOUSAND } = magnitude;

suite.add('1M push', function() {
  const deque = new Deque();
  for (let i = 0; i < MILLION; i++) {
    deque.push(i);
  }
  this.val = deque;
});

suite.add('Native JS Array 1M push', function() {
  const array = [];
  for (let i = 0; i < MILLION; i++) {
    array.push(i);
  }
  this.val = array;
});

suite.add('1M push & pop', function() {
  const deque = new Deque();
  for (let i = 0; i < MILLION; i++) {
    deque.push(i);
  }
  for (let i = 0; i < MILLION; i++) {
    deque.pop();
  }
  this.val = deque;
});

suite.add('Native JS Array 1M push & pop', function() {
  const array = [];
  for (let i = 0; i < MILLION; i++) {
    array.push(i);
  }
  for (let i = 0; i < MILLION; i++) {
    array.pop();
  }
  this.val = array;
});

suite.add('1M push & shift', function() {
  const deque = new Deque();
  for (let i = 0; i < MILLION; i++) {
    deque.push(i);
  }
  for (let i = 0; i < MILLION; i++) {
    deque.shift();
  }
  this.val = deque;
});

suite.add('100K push & shift', function() {
  const deque = new Deque();
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    deque.push(i);
  }
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    deque.shift();
  }
  this.val = deque;
});

suite.add('Native JS Array 100K push & shift', function() {
  const array = [];
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    array.push(i);
  }
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    array.shift();
  }
  this.val = array;
});

suite.add('100K unshift & shift', function() {
  const deque = new Deque();
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    deque.unshift(i);
  }
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    deque.shift();
  }
  this.val = deque;
});

suite.add('Native JS Array 100K unshift & shift', function() {
  const array = [];
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    array.unshift(i);
  }
  for (let i = 0; i < HUNDRED_THOUSAND; i++) {
    array.shift();
  }
  this.val = array;
});

export { suite };
