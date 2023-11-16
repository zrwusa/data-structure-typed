import * as Benchmark from 'benchmark';

export type PerformanceTest = { testName: string; suite: Benchmark.Suite; file: string };
