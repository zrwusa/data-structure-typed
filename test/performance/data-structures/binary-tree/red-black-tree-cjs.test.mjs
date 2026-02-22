import { createRequire } from 'module';
import * as path from 'path';

import { getRandomIntArray, magnitude } from '../../../utils/perf.mjs';

// IMPORTANT: For perf stability, load the CJS build directly (matches the standalone scripts).
// Using package ESM entry (`import { ... } from '../../../../dist/esm/index.mjs'`) showed large slowdowns
// for Node Mode get in this environment.
const require = createRequire(import.meta.url);
const { RedBlackTree } = require(path.resolve(process.cwd(), '../data-structure-typed/dist/cjs/index.cjs'));
const { OrderedMap } = require('js-sdsl');

/**
 * Red-Black Tree (macro) perf harness
 *
 * Goal: keep the report.json schema the same (Latency Avg/Min/Max/Stability)
 * but avoid Benchmark.js loop-shaping/JIT artifacts by measuring real total
 * wall-time for the intended workload (e.g. 1,000,000 operations) using hrtime.
 *
 * Notes:
 * - This module exports `getResults()` consumed by benchmark-runner-enhanced.mjs.
 * - We still support smoke testing via env knobs.
 */

const { MILLION } = magnitude;

const N = Number(process.env.RBT_N ?? MILLION);
const KEY_POOL = Number(process.env.RBT_KEY_POOL ?? 100_000);
const GET_N = Number(process.env.RBT_GET_N ?? MILLION);

// Repeats per test case. Tune for stability vs runtime.
const REPEATS = Number(process.env.RBT_REPEAT ?? 5);

function nowMs() {
    return Number(process.hrtime.bigint()) / 1e6;
}

function mean(arr) {
    let s = 0;
    for (let i = 0; i < arr.length; i++) s += arr[i];
    return s / arr.length;
}

function stddev(arr, m) {
    if (arr.length <= 1) return 0;
    let s = 0;
    for (let i = 0; i < arr.length; i++) {
        const d = arr[i] - m;
        s += d * d;
    }
    return Math.sqrt(s / (arr.length - 1));
}

// 95% t critical values for df=1..30 (two-tailed). For df>30 use ~1.96.
const T95 = [
    NaN,
    12.706, 4.303, 3.182, 2.776, 2.571,
    2.447, 2.365, 2.306, 2.262, 2.228,
    2.201, 2.179, 2.160, 2.145, 2.131,
    2.120, 2.110, 2.101, 2.093, 2.086,
    2.080, 2.074, 2.069, 2.064, 2.060,
    2.056, 2.052, 2.048, 2.045, 2.042
];

function rme95Percent(samples, m) {
    const n = samples.length;
    if (n <= 1) return 0;
    const sd = stddev(samples, m);
    const se = sd / Math.sqrt(n);
    const df = n - 1;
    const t = df <= 30 ? T95[df] : 1.96;
    const moe = t * se; // margin of error (ms)
    return m === 0 ? 0 : (moe / m) * 100;
}

function formatCase(name, samplesMs) {
    const m = mean(samplesMs);
    const minV = Math.min(...samplesMs);
    const maxV = Math.max(...samplesMs);
    const rme = rme95Percent(samplesMs, m);

    const msDigits = m < 10 ? 4 : 2;

    return {
        'Test Case': name,
        'Latency Avg (ms)': Number(m.toFixed(msDigits)),
        'Min (ms)': Number(minV.toFixed(msDigits)),
        'Max (ms)': Number(maxV.toFixed(msDigits)),
        'Stability': `±${rme.toFixed(2)}%`
    };
}

const COOLDOWN_MS = Number(process.env.RBT_COOLDOWN_MS ?? 50);

function sleepMs(ms) {
    if (!ms || ms <= 0) return;
    // Synchronous sleep without extra deps.
    // (Atomics.wait is supported in Node; this keeps the macro harness simple.)
    const sab = new SharedArrayBuffer(4);
    const i32 = new Int32Array(sab);
    Atomics.wait(i32, 0, 0, ms);
}

function maybeGC() {
    try {
        if (typeof global.gc === 'function') global.gc();
    } catch {
        // ignore
    }
}

function withRepeats(label, fn) {
    const samples = [];
    for (let r = 0; r < REPEATS; r++) {
        // Try to reduce cross-repeat noise.
        maybeGC();
        sleepMs(COOLDOWN_MS);

        const t0 = nowMs();
        fn();
        const t1 = nowMs();

        maybeGC();
        sleepMs(COOLDOWN_MS);

        const dt = t1 - t0;
        samples.push(dt);
        console.log(`  ✓ ${label} [${r + 1}/${REPEATS}] ${dt.toFixed(2)}ms`);
    }
    return formatCase(label, samples);
}

export async function getResults() {
    console.log(`RBT macro perf: N=${N.toLocaleString()} KEY_POOL=${KEY_POOL.toLocaleString()} GET_N=${GET_N.toLocaleString()} REPEATS=${REPEATS}`);

    // Pre-generate random data outside timing.
    console.log('pre-generating random data...');
    const randUniqueKeys = getRandomIntArray(N, 0, N - 1, true);
    const randUpdateKeys = getRandomIntArray(N, 0, KEY_POOL - 1, false);
    console.log('random data ready');

    const results = [];

    // GET (prefill not timed) - run first to avoid heap/GC pollution from insert/update benchmarks.
    console.log('pre-building get trees (not timed)...');
    const rbMapMode = new RedBlackTree([], { isMapMode: true });
    const rbNodeMode = new RedBlackTree([], { isMapMode: false });
    const sdslOrderedMap = new OrderedMap();
    for (let i = 0; i < GET_N; i++) {
        rbMapMode.set(i, i);
        rbNodeMode.add(i);
        sdslOrderedMap.setElement(i, i);
    }
    console.log('pre-build done');

    results.push(withRepeats(`${GET_N.toLocaleString()} get`, () => {
        let count = 0;
        for (let i = 0; i < GET_N; i++) if (rbMapMode.get(i) !== undefined) count++;
        if (count === 42) console.log('');
    }));

    results.push(withRepeats(`${GET_N.toLocaleString()} get (Node Mode)`, () => {
        let count = 0;
        for (let i = 0; i < GET_N; i++) if (rbNodeMode.get(i) !== undefined) count++;
        if (count === 42) console.log('');
    }));

    results.push(withRepeats(`${GET_N.toLocaleString()} get (js-sdsl)`, () => {
        let count = 0;
        for (let i = 0; i < GET_N; i++) if (sdslOrderedMap.getElementByKey(i) !== undefined) count++;
        if (count === 42) console.log('');
    }));

    // UPDATE (SEQ)
    results.push(withRepeats(`${MILLION.toLocaleString()} upd SEQ`, () => {
        const rbTree = new RedBlackTree([], { isMapMode: true });
        for (let i = 0; i < KEY_POOL; i++) rbTree.set(i, 0);
        for (let i = 0; i < N; i++) rbTree.set(i % KEY_POOL, i);
    }));

    results.push(withRepeats(`${MILLION.toLocaleString()} upd SEQ (Node Mode)`, () => {
        const rbTree = new RedBlackTree([], { isMapMode: false });
        for (let i = 0; i < KEY_POOL; i++) rbTree.set(i, 0);
        for (let i = 0; i < N; i++) rbTree.set(i % KEY_POOL, i);
    }));

    results.push(withRepeats(`${MILLION.toLocaleString()} upd SEQ (js-sdsl)`, () => {
        const mp = new OrderedMap();
        for (let i = 0; i < KEY_POOL; i++) mp.setElement(i, 0);
        for (let i = 0; i < N; i++) mp.setElement(i % KEY_POOL, i);
    }));

    // UPDATE (RAND)
    results.push(withRepeats(`${MILLION.toLocaleString()} upd RAND`, () => {
        const rbTree = new RedBlackTree([], { isMapMode: true });
        for (let i = 0; i < KEY_POOL; i++) rbTree.set(i, 0);
        for (let i = 0; i < N; i++) rbTree.set(randUpdateKeys[i], i);
    }));

    results.push(withRepeats(`${MILLION.toLocaleString()} upd RAND (Node Mode)`, () => {
        const rbTree = new RedBlackTree([], { isMapMode: false });
        for (let i = 0; i < KEY_POOL; i++) rbTree.set(i, 0);
        for (let i = 0; i < N; i++) rbTree.set(randUpdateKeys[i], i);
    }));

    results.push(withRepeats(`${MILLION.toLocaleString()} upd RAND (js-sdsl)`, () => {
        const mp = new OrderedMap();
        for (let i = 0; i < KEY_POOL; i++) mp.setElement(i, 0);
        for (let i = 0; i < N; i++) mp.setElement(randUpdateKeys[i], i);
    }));

    // INSERT (SEQ)
    results.push(withRepeats(`${N.toLocaleString()} ins SEQ`, () => {
        const rbTree = new RedBlackTree([], { isMapMode: true });
        for (let i = 0; i < N; i++) rbTree.set(i, i);
    }));

    results.push(withRepeats(`${MILLION.toLocaleString()} ins SEQ (Node Mode)`, () => {
        const rbTree = new RedBlackTree([], { isMapMode: false });
        for (let i = 0; i < N; i++) rbTree.add(i);
    }));

    results.push(withRepeats(`${N.toLocaleString()} ins SEQ (js-sdsl)`, () => {
        const mp = new OrderedMap();
        for (let i = 0; i < N; i++) mp.setElement(i, i);
    }));

    // INSERT (RAND unique)
    results.push(withRepeats(`${MILLION.toLocaleString()} ins RAND`, () => {
        const rbTree = new RedBlackTree([], { isMapMode: true });
        for (let i = 0; i < N; i++) {
            const k = randUniqueKeys[i];
            rbTree.set(k, k);
        }
    }));

    results.push(withRepeats(`${MILLION.toLocaleString()} ins RAND (Node Mode)`, () => {
        const rbTree = new RedBlackTree([], { isMapMode: false });
        for (let i = 0; i < N; i++) rbTree.add(randUniqueKeys[i]);
    }));

    results.push(withRepeats(`${MILLION.toLocaleString()} ins RAND (js-sdsl)`, () => {
        const mp = new OrderedMap();
        for (let i = 0; i < N; i++) {
            const k = randUniqueKeys[i];
            mp.setElement(k, k);
        }
    }));

    // Baseline: keys-only
    results.push(withRepeats(`${MILLION.toLocaleString()} keys-only`, () => {
        let s = 0;
        for (let i = 0; i < N; i++) s += randUniqueKeys[i];
        // consume
        if (s === 42) console.log('');
    }));

    return results;
}
