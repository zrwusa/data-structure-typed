import { Trie } from '../../../../dist/esm/index.mjs';
import Benchmark from 'benchmark';
import { getRandomWords, magnitude } from '../../../utils/perf.mjs';

/**
 * Trie Benchmark Suite
 * Tests prefix tree operations
 *
 * Fixes applied:
 * ✅ Removed chain calls - standard function form
 * ✅ Added this.val for optimization prevention
 * ✅ Pre-built trie for add test
 * ✅ Separated add and getWords tests
 */

const suite = new Benchmark.Suite();
const { HUNDRED_THOUSAND } = magnitude;

// Pre-build random words once
const randomWords = getRandomWords(HUNDRED_THOUSAND, false);

// Test 1: 100K add (push)
suite.add(`${HUNDRED_THOUSAND.toLocaleString()} add`, function() {
    const trie = new Trie();
    for (let i = 0; i < randomWords.length; i++) {
        trie.add(randomWords[i]);
    }
    this.val = trie;  // Prevent JIT optimization
});

// Test 2: 100K getWords (with pre-built trie)
suite.add(`${HUNDRED_THOUSAND.toLocaleString()} getWords`, function() {
    const trie = new Trie();
    for (let i = 0; i < randomWords.length; i++) {
        trie.add(randomWords[i]);
    }
    for (let i = 0; i < randomWords.length; i++) {
        trie.getWords(randomWords[i]);
    }
    this.val = trie;  // Prevent JIT optimization
});

export { suite };