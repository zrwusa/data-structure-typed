import * as Benchmark from 'benchmark';
import * as path from 'path';
import * as fs from 'fs';
import * as fastGlob from 'fast-glob';

const reportDistPath = 'benchmark';
const testDir = path.join(__dirname, 'data-structures');
const testFiles = fastGlob.sync(path.join(testDir, '**', '*.test.ts'));

const report: {[key: string] : any} = {};

let i = 0;
testFiles.forEach((file: string) => {
  i++;
  console.log(`testing file ${file}`);
  const testName = path.basename(file, '.test.ts');
  const testFunction = require(file);
  const {suite} = testFunction;

  if (suite) {
    suite.on('cycle', (event: any) => {
      console.log(String(event.target));
    });

    suite.on('complete', function (this: Benchmark.Suite) {
      console.log('Fastest is ' + this.filter('fastest').map('name'));
      report[testName] = this.map((test: Benchmark) => ({
        name: test.name,
        periodMS: test.times.period * 1000,
        hz: test.hz,
        count: test.count,
        mean: test.stats.mean,
        deviation: test.stats.deviation,
      }));
      // report[testName] = this;
      console.log('----i', i, testFiles.length)
      if (testFiles.length === i) {
        if (!fs.existsSync(reportDistPath)) fs.mkdirSync(reportDistPath, { recursive: true });

        const filePath = path.join(reportDistPath, 'report.json');
        fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
        console.log('Performance test report file generated')
      }
    })
      .run({async: true});
  }
});