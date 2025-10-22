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
          'test name': benchmark.name,
          'time taken (ms)': numberFix(benchmark.times.period * 1000, 2),
          'sample mean (secs)': numberFix(benchmark.stats.mean, 2),
          'sample deviation': numberFix(benchmark.stats.deviation, 2)
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
