import * as Benchmark from 'benchmark';
import * as path from 'path';
import * as fs from 'fs';
import * as fastGlob from 'fast-glob';
import {numberFix, render, Color} from './utils';
import {PerformanceTest} from './types';

const reportDistPath = 'benchmark';
const testDir = path.join(__dirname, 'data-structures');
const testFiles = fastGlob.sync(path.join(testDir, '**', '*.test.ts'));

const report: {[key: string]: any} = {};

let testFileCount = 0,
  completedCount = 0;

const performanceTests: PerformanceTest[] = [];
const {GREEN, BOLD, END} = Color;

testFiles.forEach((file: string) => {
  testFileCount++;
  const testName = path.basename(file, '.test.ts');
  const testFunction = require(file);
  const {suite} = testFunction;
  if (suite) performanceTests.push({testName, suite, file});
});

const composeReport = () => {
  if (!fs.existsSync(reportDistPath)) fs.mkdirSync(reportDistPath, {recursive: true});

  const filePath = path.join(reportDistPath, 'report.json');
  const htmlFilePath = path.join(reportDistPath, 'report.html');
  fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
  let html = `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                          <meta charset="UTF-8">
                          <title>performance of data-structure-typed</title>
                          <style>
                               .content table {
                                  width: 100%;
                                  table-layout: fixed;
                                  border-collapse: collapse;
                                  margin-top: 10px;
                                  font-size: 16px;
                                }
                            
                                .content table th,
                                .content table td {
                                  padding: 8px 12px;
                                  text-align: left;
                                  border: 1px solid #ddd;
                                }
                            
                                .content table th {
                                  background-color: #f2f2f2;
                                  font-weight: bold;
                                }
                            
                                .content table tr:nth-child(odd) {
                                  background-color: #ffffff;
                                }
                            </style>
                        </head>
                        <body>
                        <div id="json-to-html">`;
  for (const r in report) {
    if (report.hasOwnProperty(r)) {
      html += render(report[r].testName, report[r].benchmarks, {
        plainHtml: true,
        '<>': 'table',
        html: [
          {
            '<>': 'tr',
            html: [
              {'<>': 'td', html: '${name}'},
              {'<>': 'td', html: '${periodMS}'},
              {'<>': 'td', html: '${mean}'}
            ]
          }
        ]
      });
    }
  }

  html += `</div>
                    </body>
                  </html>`;
  fs.writeFileSync(htmlFilePath, html);
  console.log(`Performance ${BOLD}${GREEN}report${END} file generated`);
};

performanceTests.forEach(item => {
  const {suite, testName, file} = item;
  console.log(`testing file ${GREEN}${file}${END}`);

  if (suite) {
    suite
      .on('complete', function (this: Benchmark.Suite) {
        completedCount++;
        report[testName] = {};
        report[testName].benchmarks = this.map((benchmark: Benchmark) => ({
          'test name': benchmark.name,
          'time taken (ms)': numberFix(benchmark.times.period * 1000, 2),
          'executions per sec': numberFix(benchmark.hz, 2),
          // 'executed times': numberFix(benchmark.count, 2),
          'sample mean (secs)': numberFix(benchmark.stats.mean, 2),
          'sample deviation': numberFix(benchmark.stats.deviation, 2)
        }));
        report[testName].testName = testName;

        console.log(
          `test files: ${GREEN}${testFileCount}${END}. suites: ${GREEN}${performanceTests.length}${END}. completed suites: ${GREEN}${completedCount}${END}`
        );
        if (completedCount === performanceTests.length) {
          composeReport();
        }
      })
      .run({async: false});
  }
});
