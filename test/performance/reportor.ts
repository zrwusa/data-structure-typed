import * as Benchmark from 'benchmark';
import * as path from 'path';
import * as fs from 'fs';
import * as fastGlob from 'fast-glob';
import {Color, numberFix, render} from '../utils';
import {PerformanceTest} from './types';

const reportDistPath = 'benchmark';
const testDir = path.join(__dirname, 'data-structures');
const testFiles = fastGlob.sync(path.join(testDir, '**', '*.test.ts'));

const report: {[key: string]: any} = {};

let completedCount = 0;

const performanceTests: PerformanceTest[] = [];
const {GREEN, BOLD, END, YELLOW, GRAY, CYAN, BG_YELLOW} = Color;

testFiles.forEach((file: string) => {
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
                          *{
                          box-sizing: border-box;
                          }
                                #json-to-html {
                                padding: 0 10px 20px;
                                }
                                
                                .json-to-html-label {
                                    font-size: 2rem;
                                    margin: 2rem 0 0 3px;
                                }
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
  let htmlTables = '';
  for (const r in report) {
    if (report.hasOwnProperty(r)) {
      htmlTables += render(report[r].testName, report[r].benchmarks, {
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
  html += htmlTables;
  html += `</div>
                    </body>
                  </html>`;
  writeIntoMarkdown(htmlTables);
  fs.writeFileSync(htmlFilePath, html);
  console.log(`Performance ${BOLD}${GREEN}report${END} file generated`);
};

function writeIntoMarkdown(html: string) {
  const parentDirectory = path.resolve(__dirname, '../..'); // The path to the parent directory
  const markdownFilePath = path.join(parentDirectory, 'README.md'); // Path to README.md file
  const textToInsert = html;

  // Read the original README.md file
  fs.readFile(markdownFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Unable to read README.md file：', err);
      return;
    }

    // Find the location in the README.md file where you want to insert the text, for example under a specific tag
    const insertMarker = '## Benchmark';

    const index = data.indexOf(insertMarker);
    if (index === -1) {
      console.error('Unable to find insertion point');
      return;
    }

    // insert text
    const updatedMarkdown =
      data.slice(0, index + insertMarker.length) + '\n' + textToInsert + data.slice(index + insertMarker.length);

    // Try writing the modified content back to the README.md file
    fs.writeFile(markdownFilePath, updatedMarkdown, 'utf8', err => {
      if (err) {
        console.error('Unable to write to README.md file：', err);
      } else {
        console.log('The tables have been successfully inserted into the README.md file!');
      }
    });
  });
}

performanceTests.forEach(item => {
  const {suite, testName, file} = item;
  const relativeFilePath = path.relative(__dirname, file);
  const directory = path.dirname(relativeFilePath);
  const fileName = path.basename(relativeFilePath);
  console.log(`${BG_YELLOW}Running in${END}: ${GRAY}${directory}/${END}${CYAN}${fileName}${END}`);

  if (suite) {
    let runTime = 0;
    suite
      .on('complete', function (this: Benchmark.Suite) {
        completedCount++;
        report[testName] = {};
        report[testName].benchmarks = this.map((benchmark: Benchmark) => {
          runTime += benchmark.times.elapsed;
          return {
            'test name': benchmark.name,
            'time taken (ms)': numberFix(benchmark.times.period * 1000, 2),
            'executions per sec': numberFix(benchmark.hz, 2),
            'executed times': numberFix(benchmark.count, 0),
            'sample mean (secs)': numberFix(benchmark.stats.mean, 2),
            'sample deviation': numberFix(benchmark.stats.deviation, 2)
          };
        });

        report[testName].testName = testName;
        const isDone = completedCount === performanceTests.length;
        runTime = Number(runTime.toFixed(2));
        const isTimeWarn = runTime > 120;
        console.log(
          // `Files: ${GREEN}${testFileCount}${END} `,
          // `Suites: ${GREEN}${performanceTests.length}${END} `,
          `Suites Progress: ${isDone ? GREEN : YELLOW}${completedCount}${END}/${isDone ? GREEN : YELLOW}${
            performanceTests.length
          }${END}`,
          `Time: ${isTimeWarn ? YELLOW : GREEN}${runTime}s${END}`
        );
        if (isDone) {
          composeReport();
        }
      })
      .run({async: false});
  }
});
