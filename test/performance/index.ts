import * as Benchmark from 'benchmark';
import * as path from 'path';
import * as fs from 'fs';
import * as fastGlob from 'fast-glob';
import {numberFix, render} from './utils';

const reportDistPath = 'benchmark';
const testDir = path.join(__dirname, 'data-structures');
const testFiles = fastGlob.sync(path.join(testDir, '**', '*.test.ts'));

const report: {[key: string]: any} = {};

let testFileCount = 0,
  suiteCount = 0,
  completedCount = 0;
testFiles.forEach((file: string) => {
  testFileCount++;
  console.log(`testing file ${file}`);
  const testName = path.basename(file, '.test.ts');
  const testFunction = require(file);
  const {suite} = testFunction;

  if (suite) {
    suiteCount++;
    suite.on('cycle', (event: any) => {
      console.log(event.target.toString());
    });

    suite
      .on('complete', function (this: Benchmark.Suite) {
        completedCount++;
        console.log('Fastest is ' + this.filter('fastest').map('name'));
        report[testName] = this.map((test: Benchmark) => ({
          'test name': test.name,
          'time consumption (ms)': numberFix(test.times.period * 1000, 2),
          'executions per second': numberFix(test.hz, 2),
          'executed times': numberFix(test.count, 2),
          'sample arithmetic mean (secs)': numberFix(test.stats.mean, 2),
          'sample deviation': numberFix(test.stats.deviation, 2)
        }));

        // report[testName] = this;
        console.log(
          `test file count: ${testFileCount}. suite count: ${suiteCount}. completed suite count: ${completedCount}`
        );
        if (completedCount === suiteCount) {
          if (!fs.existsSync(reportDistPath)) fs.mkdirSync(reportDistPath, {recursive: true});

          const filePath = path.join(reportDistPath, 'report.json');
          const htmlFilePath = path.join(reportDistPath, 'report.html');
          fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
          let html = `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                          <meta charset="UTF-8">
                          <title>Title</title>
                          <style>
                               .content table {
                                  width: 100%;
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
              html += render(report[r], {
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
          console.log('Performance test report file generated');
        }
      })
      .run({async: true});
  }
});
