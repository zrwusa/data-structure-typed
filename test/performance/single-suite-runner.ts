import * as path from 'path';
import * as url from 'url';
import * as Benchmark from 'benchmark';
import { numberFix } from '../utils';

function fileToURL(file: string) {
  return url.pathToFileURL(file).href;
}

async function loadTestModule(file: string): Promise<any> {
  if (file.endsWith('.mjs')) {
    return await import(fileToURL(file));
  }
  try {
    // @ts-ignore
    return require(file);
  } catch (e: any) {
    if (e && e.code === 'ERR_REQUIRE_ESM') {
      return await import(fileToURL(file));
    }
    throw e;
  }
}

const file = process.argv[2];
if (!file) {
  console.error('single-suite-runner requires a test file path.');
  process.exit(1);
}

(async () => {
  const testName = path.basename(file).replace(/\.test\.[^.]+$/, '');
  const mod = await loadTestModule(file);
  const suite: Benchmark.Suite | undefined = mod?.suite || mod?.default?.suite;

  if (!suite) {
    if (process.send) process.send({ testName, benchmarks: [], file });
    process.exit(0);
  }

  try {
    suite.forEach((b: any) => {
      if (typeof b.fn === 'function') b.fn.call(b);
    });
  } catch {}

  if (global.gc) global.gc();

  let runTime = 0;
  suite
    .on('complete', function (this: Benchmark.Suite) {
      const benchmarks = this.map((benchmark: any) => {
        runTime += benchmark.times.elapsed;
        return {
          'Test Case': benchmark.name,
          'Latency Avg (ms)': numberFix(benchmark.stats.mean * 1000, 2), // Average time
          'Min (ms)': numberFix(Math.min(...benchmark.stats.sample) * 1000, 2),
          'Max (ms)': numberFix(Math.max(...benchmark.stats.sample) * 1000, 2),
          'Stability': `±${numberFix(benchmark.stats.rme, 2)}%`,              // Relative error (better to understand than deviation)
          // 'Samples': benchmark.stats.sample.length,                           // Number of samples
          // 'Ops/Sec': Math.round(benchmark.hz).toLocaleString(),               // Operations per second
        };
      });
      runTime = Number(runTime.toFixed(2));
      if (process.send) process.send({ testName, benchmarks, runTime, file });
      process.exit(0);
    })
    .run({ async: false });
})().catch(err => {
  console.error(err);
  process.exit(1);
});
