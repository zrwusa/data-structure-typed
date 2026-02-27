import { RedBlackTree } from '../../../../dist/esm/index.mjs';
import { OrderedMap } from 'js-sdsl';

import { getRandomIntArray, magnitude } from '../../../utils/perf.mjs';

/**
 * Red-Black Tree (macro, ESM entry) perf harness
 *
 * Same report shape as red-black-tree.test.mjs, but intentionally loads
 * the library via the package ESM entry (`import { ... } from '../../../../dist/esm/index.mjs'`).
 *
 * Requires: run `pnpm refresh:dst` (or reinstall) after building dst, so node_modules
 * dist/esm is up to date.
 */

const { MILLION } = magnitude;

const N = Number(process.env.RBT_N ?? MILLION);
const KEY_POOL = Number(process.env.RBT_KEY_POOL ?? 100_000);
const GET_N = Number(process.env.RBT_GET_N ?? MILLION);

// rangeSearch knobs (macro-bench can be expensive; keep defaults moderate)
const QUERY_COUNT = Number(process.env.RBT_QUERY_COUNT ?? 200_000);
const RANGE_SIZE = Number(process.env.RBT_RANGE_SIZE ?? 10);

const REPEATS = Number(process.env.RBT_REPEAT ?? 5);
const COOLDOWN_MS = Number(process.env.RBT_COOLDOWN_MS ?? 50);

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
    const moe = t * se;
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

function sleepMs(ms) {
    if (!ms || ms <= 0) return;
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
    const ONLY_GET = process.env.RBT_ONLY_GET === '1';
    console.log(`RBT macro perf (ESM): N=${N.toLocaleString()} KEY_POOL=${KEY_POOL.toLocaleString()} GET_N=${GET_N.toLocaleString()} REPEATS=${REPEATS}`);

    console.log('pre-generating random data...');
    const randUniqueKeys = getRandomIntArray(N, 0, N - 1, true);
    const randUpdateKeys = getRandomIntArray(N, 0, KEY_POOL - 1, false);
    console.log('random data ready');

    const results = [];

    // GET first
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

    // rangeSearch tree + queries (NOT timed)
    console.log(`pre-building rangeSearch tree + queries (not timed)... QUERY_COUNT=${QUERY_COUNT.toLocaleString()} RANGE_SIZE=${RANGE_SIZE}`);
    const rbTreeForRangeSearch = new RedBlackTree([], { isMapMode: false });
    for (let i = 0; i < N; i++) rbTreeForRangeSearch.add(randUniqueKeys[i]);
    const queryMins = getRandomIntArray(QUERY_COUNT, 0, Math.max(1, N - RANGE_SIZE), false);
    console.log('rangeSearch pre-build done');

    results.push(withRepeats(`${GET_N.toLocaleString()} get`, () => {
        let count = 0;
        for (let i = 0; i < GET_N; i++) if (rbMapMode.get(i) !== undefined) count++;
        if (count === 42) console.log('');
    }));

    results.push(withRepeats(`${GET_N.toLocaleString()} get (classic)`, () => {
        let count = 0;
        for (let i = 0; i < GET_N; i++) if (rbNodeMode.get(i) !== undefined) count++;
        if (count === 42) console.log('');
    }));

    results.push(withRepeats(`${GET_N.toLocaleString()} get (js-sdsl)`, () => {
        let count = 0;
        for (let i = 0; i < GET_N; i++) if (sdslOrderedMap.getElementByKey(i) !== undefined) count++;
        if (count === 42) console.log('');
    }));

    // rangeSearch (SEQ): ranges [i, i+RANGE_SIZE]
    results.push(withRepeats(`${QUERY_COUNT.toLocaleString()} rangeSearch SEQ`, () => {
        let totalResults = 0;
        for (let i = 0; i < QUERY_COUNT; i++) {
            const res = rbTreeForRangeSearch.rangeSearch([i, i + RANGE_SIZE]);
            totalResults += res.length;
        }
        if (totalResults === 42) console.log('');
    }));

    // rangeSearch (RAND): random ranges within [min, min+RANGE_SIZE]
    results.push(withRepeats(`${QUERY_COUNT.toLocaleString()} rangeSearch RAND`, () => {
        let totalResults = 0;
        for (let i = 0; i < QUERY_COUNT; i++) {
            const min = queryMins[i];
            const res = rbTreeForRangeSearch.rangeSearch([min, min + RANGE_SIZE]);
            totalResults += res.length;
        }
        if (totalResults === 42) console.log('');
    }));

    if (ONLY_GET) return results;

    // UPDATE (SEQ)
    results.push(withRepeats(`${MILLION.toLocaleString()} upd SEQ`, () => {
        const rbTree = new RedBlackTree([], { isMapMode: true });
        for (let i = 0; i < KEY_POOL; i++) rbTree.set(i, 0);
        for (let i = 0; i < N; i++) rbTree.set(i % KEY_POOL, i);
    }));

    results.push(withRepeats(`${MILLION.toLocaleString()} upd SEQ (classic)`, () => {
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

    results.push(withRepeats(`${MILLION.toLocaleString()} upd RAND (classic)`, () => {
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

    results.push(withRepeats(`${MILLION.toLocaleString()} ins SEQ (classic)`, () => {
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

    results.push(withRepeats(`${MILLION.toLocaleString()} ins RAND (classic)`, () => {
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
        if (s === 42) console.log('');
    }));

    return results;
}
